export function formatPrice(price, currency) {
  return price?.toLocaleString("de-DE") + " " + currency;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function convertToDate(dateTime) {
  const date = new Date(dateTime);

  return date.toLocaleDateString("en-CA");
}

export function timeStringToMinutes(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
}

export function addTime(startTime, duration) {
  // Create a base date
  const baseDate = new Date("1970-01-01T00:00:00Z");

  // Split the start time and duration into hours and minutes
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [durationHours, durationMinutes] = duration.split(":").map(Number);

  // Create a Date object for the start time
  const startDate = new Date(baseDate);
  startDate.setUTCHours(startHours);
  startDate.setUTCMinutes(startMinutes);

  // Add the duration to the start time
  startDate.setUTCHours(startDate.getUTCHours() + durationHours);
  startDate.setUTCMinutes(startDate.getUTCMinutes() + durationMinutes);

  // Format the result back to "HH:mm"
  const resultHours = String(startDate.getUTCHours()).padStart(2, "0");
  const resultMinutes = String(startDate.getUTCMinutes()).padStart(2, "0");

  return `${resultHours}:${resultMinutes}`;
}

export function isTimeDifferenceGreaterThan(time1, time2, threshold) {
  // Parse the hours and minutes from the time strings
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);
  const [thresholdHours, thresholdMinutes] = threshold.split(":").map(Number);

  // Convert the times to minutes
  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;
  const thresholdMinutesTotal = thresholdHours * 60 + thresholdMinutes;

  // Calculate the difference in minutes
  const difference = Math.abs(totalMinutes2 - totalMinutes1);

  // Check if the difference is greater than the threshold
  return difference >= thresholdMinutesTotal;
}

export function formatTimeString(timeString) {
  return timeString?.split(":").slice(0, 2).join(":");
}

export function isAtLeastTomorrow(dateString) {
  const givenDate = new Date(dateString);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  return givenDate >= tomorrow;
}

export function calculateEndTime(start, interval) {
  if (!start || !interval) return "";

  const [startHours, startMinutes] = start.split(":").map(Number);
  const [intervalHours, intervalMinutes] = interval.split(":").map(Number);

  if (
    isNaN(startHours) ||
    isNaN(startMinutes) ||
    isNaN(intervalHours) ||
    isNaN(intervalMinutes)
  ) {
    return "";
  }

  const startDate = new Date();
  startDate.setHours(startHours);
  startDate.setMinutes(startMinutes);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  const endDate = new Date(
    startDate.getTime() + intervalHours * 3600000 + intervalMinutes * 60000,
  );

  const endHours = String(endDate.getHours()).padStart(2, "0");
  const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

  return `${endHours}:${endMinutes}`;
};