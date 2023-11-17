const METERS_PER_MILE = 1609.34;
const MILES_PER_METER = 0.000621371;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

/**
 * Converts a value in meters to miles, rounded to the nearest hundreth of a mile
 * @param meters Value in meters to convert
 * @returns Equivalent value in miles, rounded to the hundreth
 */
export const metersToMiles = (meters: number) => {
  return (meters * MILES_PER_METER).toFixed(2);
};

/**
 * Converts a vlue in meters per second to seconds per mile
 * @param metersPerSecond Value of meters per second to convert
 * @returns The number of seconds per mile, rounded to the nearest second
 */
export const metersPerSecondToSecondsPerMile = (metersPerSecond: number) => {
  return Math.round(METERS_PER_MILE / metersPerSecond);
};

/**
 * Formats a value from seconds into a readible time duration string H:MM:SS. Hours will only be included
 * if the duration is 60 minutes or more
 *
 * TODO: unit test this
 * @param seconds Value in number of seconds
 */
export const formateTimeDuration = (seconds: number) => {
  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  seconds %= SECONDS_PER_HOUR;
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  seconds %= SECONDS_PER_MINUTE;
  return `${hours ? hours + ":" : ""}${
    minutes ? (minutes < 10 && hours ? "0" + minutes.toString() : minutes) : 0
  }:${seconds < 10 ? "0" + seconds.toString() : seconds}`;
};
