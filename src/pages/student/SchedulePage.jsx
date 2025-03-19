import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import parseJwt from "../../services/parseJwt";
import listPlugin from "@fullcalendar/list";
import { GetAllSchedulesOfUser } from "../../services/ApiServices/ScheduleService";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { logDOM } from "@testing-library/react";

export function SchedulePage({ token }) {
  const id = token ? parseJwt(token).nameid : "";
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);

  const days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  function countSpecificDays(startDate, numsOfSlot, daysOfWeek, daySpecified) {
    console.log(startDate);
    // Convert the input dates to Date objects
    const start = new Date(startDate);
    const startMoment = moment(start);
    let i = numsOfSlot;
    // console.log(daySpecified);
    let countDay = 0;
    for(let m=startMoment; i > 0; m.add(1, "days")){
      // console.log(m.format("YYYY-MM-DD"));
      if(daysOfWeek.includes(m.days())){
        i--;
      }
      if(m.days() == daySpecified){
        countDay++;
      }
    }
    console.log(countDay);

    // Initialize the counter for the days of the week
    // let count = 0;

    // Loop through the dates from start to end
    // for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    //     const day = date.getDay(); // getDay() returns 0 for Sunday, 1 for Monday, etc.
    //     if (daysOfWeek.includes(day)) {
    //         count++;
    //     }
    // }

    return countDay;
}


  const fetchSchedules = async (e) => {
    let data = null;
    try {
      data = await GetAllSchedulesOfUser(id);
      data = data.filter(
        (x) =>
          x.booking.status.toUpperCase() === "PAID" ||
          x.booking.status.toUpperCase() === "TRANSFERRED",
      );
      console.log(data);
      setSchedules(data);

      let eventList = [];
      let existingDates = [];
      const groupedByBookingId = data.reduce((acc, item) => {
        // If the bookingId is not yet a key in the accumulator object, create it and initialize with an empty array
        if (!acc[item.bookingId]) {
            acc[item.bookingId] = [];
        }
        // Push the current item into the array associated with the bookingId
        acc[item.bookingId].push(item);
        return acc;
      }, {});
      console.log(groupedByBookingId);
      
      for (let d of data) {
        //if(!d) continue;
        //console.log(d);
        const tutor = d.booking.bookingUsers?.filter(
          (x) => x.role.toUpperCase() === "TUTOR",
        )[0];
        const slotNum = d.booking.numOfSlots;
        // console.log(d.booking.startDate);
        
        //console.log(groupedByBookingId);
        const da = []
        for(let day of groupedByBookingId[d.bookingId]){
          da.push(days[day.dayOfWeek])
        }
        //console.log(da);
        const e = generateEvents(
          moment(d.booking.startDate),
          //formatDate(d.endTime),
          countSpecificDays(moment(d.booking.startDate).format("YYYY-MM-DD"), slotNum,
            da,days[d.dayOfWeek]
            ),
          d.startTime,
          d.duration,
          d.booking.subject.name +
            " - " +
            d.booking.level.levelName +
            (tutor != null ? " with " + tutor?.user.userName : ""),
          days[d.dayOfWeek],
          existingDates,
        );
        eventList.push(...e);
        //console.log(formatDate(d.startTime), formatDate(d.endTime));
        //console.log(splitDaysOfWeek(d.dayOfWeek));
        //console.log(e);
      }
      setEvents(eventList);
    } catch (err) {
      console.log(err);
      if (err.response.data.message) {
        // If the error response contains a message, set it as the error message
        setError(err.response.data.message);
      } else if (err.response.data[0].description) {
        setError(err.response.data[0].description);
      } else if (err.response.data) {
        setError(err.response.data);
      } else {
        // If the error is something else, set a generic error message
        setError("An error occurred. Please try again later.");
      }
      return;
    }
  };

  const generateEvents = (
    startDate,
    numOfSlot,
    startTime,
    duration,
    subjectName,
    dayOfWeek,
    existingDates,
  ) => {
    const start = startDate;
    //const end = moment(endDate);
    const events = [];
    let slotsAdded = 0;
    //console.log(numOfSlot);
    //console.log(dayOfWeek);

    // console.log(numOfSlot);
    for (let m = start; slotsAdded < numOfSlot; m.add(1, "days")) {
      if (dayOfWeek === m.day()) {
        const startDateTime = moment(m.format("YYYY-MM-DD") + "T" + startTime);
        const endDateTime = startDateTime
          .clone()
          .add(moment.duration(duration));
        //console.log(endDateTime.format('YYYY-MM-DDTHH:mm:ss'))
        events.push({
          title: subjectName,
          start: m.format("YYYY-MM-DD") + "T" + startTime,
          end: endDateTime.format("YYYY-MM-DDTHH:mm:ss"),
          allDay: false,
        });
        slotsAdded++;
      }
    }

    //console.log(existingDates);

    return events;
  };

  // const formatDate = (timestamp) => {
  //   return moment(timestamp).format("YYYY-MM-DD");
  // };
  //
  // const splitDaysOfWeek = (daysOfWeek) => {
  //   if (!daysOfWeek) {
  //     return [];
  //   }
  //   return daysOfWeek.split(", ").map(Number);
  // };
  //
  // const filteredEvents = (events) => {
  //   return events.filter((event) => {
  //     var eventDate = moment(event.start); // Assumes `event.start` is in a parsable date format
  //     var currentMonthStart = moment().startOf("month");
  //     var currentMonthEnd = moment().endOf("month");
  //
  //     return eventDate.isBetween(
  //       currentMonthStart,
  //       currentMonthEnd,
  //       null,
  //       "[]",
  //     );
  //   });
  // };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="w-full">
      {/*JSON.stringify(schedules)*/}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        views={{
          dayGridMonth: { buttonText: "month" },
          timeGridWeek: { buttonText: "week" },
          timeGridDay: { buttonText: "day" },
          listWeek: { buttonText: "list" },
        }}
        events={events}
        dayMaxEvents={3}
        eventDisplay="auto"
        eventContent={(arg) => {
          // Create the event time string
          // let eventTimeString = '';
          // if (arg.event.start && arg.event.end) {
          //     let startTime = moment(arg.event.start).format("HH:mm");
          //     let endTime = moment(arg.event.end).format("HH:mm");
          //     eventTimeString = startTime - endTime+"";
          // } else if (arg.event.start) {
          //     let startTime = moment(arg.event.start).format("HH:mm");
          //     eventTimeString = startTime+"";
          // }
          let startTime = moment(arg.event.start).format("HH:mm");
          let endTime = moment(arg.event.end).format("HH:mm");

          // Combine the title and time string
          let titleWithTime = document.createElement("div");
          titleWithTime.innerHTML = `<span style="color: blue; font-weight: bold">${startTime} - ${endTime}</span><b style="margin-left: 5px">${arg.event.title}</b>`;

          // Create the event content
          let arrayOfDomNodes = [titleWithTime];
          return { domNodes: arrayOfDomNodes };
        }}
      />
    </div>
  );
}
