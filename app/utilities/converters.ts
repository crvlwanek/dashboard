const METERS_PER_MILE = 1609.34
const MILES_PER_METER = 0.000621371
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_MINUTE = 60

export type Duration = {
  hours: number
  minutes: number
  seconds: number
}

/**
 * Converts a value in meters to miles, rounded to the nearest hundreth of a mile
 * @param meters Value in meters to convert
 * @returns Equivalent value in miles, rounded to the hundreth
 */
export const metersToMiles = (meters: number) => {
  return (meters * MILES_PER_METER).toFixed(2)
}

/**
 * Converts a vlue in meters per second to seconds per mile
 * @param metersPerSecond Value of meters per second to convert
 * @returns The number of seconds per mile, rounded to the nearest second
 */
export const metersPerSecondToSecondsPerMile = (metersPerSecond: number) => {
  return Math.round(METERS_PER_MILE / metersPerSecond)
}

/**
 * Takes an amount of time in seconds and converts it to hours/minutes/seconds
 * @param seconds The amount of time in seconds
 * @returns The amount of time split into hours, minutes, and seconds
 */
export const secondsToDuration = (seconds: number): Duration => {
  const hours = Math.floor(seconds / SECONDS_PER_HOUR)
  seconds %= SECONDS_PER_HOUR
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE)
  seconds %= SECONDS_PER_MINUTE
  return { hours, minutes, seconds }
}

/**
 * Formats a value from Duration into a readable string of the format chosen. Hours will only be included
 * if the duration is 60 minutes or more
 *
 * @param duration Value in Duration format
 * @param format The format wanted, either colon delimited or using time letters (h / m / s)
 */
export const formatTimeDuration = (duration: Duration, format: "colon" | "letter"): string => {
  const { hours, minutes, seconds } = duration
  if (format === "colon") {
    return `${hours ? hours + ":" : ""}${
      minutes ? (minutes < 10 && hours ? "0" + minutes.toString() : minutes) : 0
    }:${seconds < 10 ? "0" + seconds.toString() : seconds}`
  }

  return `${hours ? hours + "h " : ""}${minutes + "m "}${!hours ? seconds + "s" : ""}`
}

export function getRelativeTime(datetime: string): string {
  const time = new Date(datetime).getTime()
  const deltaSeconds = Math.round((time - Date.now()) / 1000)
  const increments = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ]
  const index = increments.findIndex(increment => increment > Math.abs(deltaSeconds))
  const divisor = index ? increments[index - 1] : 1
  // ~~ is the same as Math.trunc but better browser support
  const value = ~~(deltaSeconds / divisor)
  const unit = units[index]
  return new Intl.RelativeTimeFormat("en-us", { numeric: "auto" }).format(value, unit)
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
