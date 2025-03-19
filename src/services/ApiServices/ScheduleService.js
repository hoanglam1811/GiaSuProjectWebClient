import axios from "axios";
import getEndpoint from "../getEndpoint";
import { addTime, formatTimeString, timeStringToMinutes } from "../utils";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllSchedulesOfUser(id) {
  const response = await axios.get(
    `${getEndpoint()}/api/Schedule/GetAllByUserId?userId=${id}`,
    ngrokSkipWarning,
  );

  return response.data;
}

export async function CreateSchedule(createScheduleDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Schedule/Add`,
    createScheduleDto,
    ngrokSkipWarning,
  );
  return response.data;
}

export function isOverlapping(existingSchedules, newSchedule) {
  if (!existingSchedules) {
    return false;
  }

  const newStartTime = formatTimeString(newSchedule.startTime);
  const newDuration = formatTimeString(newSchedule.duration);
  const newEndTime = addTime(newStartTime, newDuration);

  for (const schedule of existingSchedules) {
    const startTime = formatTimeString(schedule.startTime);
    const duration = formatTimeString(schedule.duration);
    const endTime = addTime(startTime, duration);

    if (
      schedule.booking.status === "PAID" &&
      newSchedule.dayOfWeek === schedule.dayOfWeek &&
      newStartTime < endTime &&
      newEndTime > startTime
    ) {
      return true;
    }
  }
  return false;
}
