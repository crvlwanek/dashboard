import { capitalize } from "./converters"

export class DateTime {
  public static yearMonthDifference(
    startDate: Date,
    endDate: Date
  ): { years: number; months: number } {
    const endMonths = endDate.getFullYear() * 12 + endDate.getMonth() + 1
    const startMonths = startDate.getFullYear() * 12 + startDate.getMonth() + 1

    const deltaMonths = endMonths - startMonths
    const years = Math.floor(deltaMonths / 12)
    const months = deltaMonths % 12
    return { years, months }
  }

  private static readonly _daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  private static _oneDayMilliseconds: number = 86_400_000

  private _date: Date

  public static now(): DateTime {
    return new DateTime()
  }

  public static today(): DateTime {
    return DateTime.now().midnight()
  }

  public static yesterday(): DateTime {
    return DateTime.now().offset({ days: -1 }).midnight()
  }

  public static tomorrow(): DateTime {
    return DateTime.now().offset({ days: 1 }).midnight()
  }

  public constructor()
  public constructor(value: Date)
  public constructor(value: string)
  public constructor(value: number)
  public constructor(value?: Date | string | number) {
    switch (typeof value) {
      case "undefined":
        this._date = new Date()
        return
      case "string":
      case "number":
        this._date = new Date(value)
        return
    }
    // Apparently this doesn't have 100% browser support?
    console?.assert(value instanceof Date, "Recieved invalid object: " + value.toString())
    this._date = value
  }

  /** Returns the value of the underlying date in milliseconds */
  public value(): number {
    return this._date.valueOf()
  }

  /** Returns the current date in locale specific format */
  public date(): string {
    return this._date.toLocaleDateString()
  }

  /** Returns the day of the week as a readable string */
  public dayOfWeek(): string {
    return DateTime._daysOfWeek[this._date.getDay()]
  }

  /** Returns the same date, but with the time set to midnight */
  public midnight(): DateTime {
    return new DateTime(this._date.setHours(0, 0, 0, 0))
  }

  public relativeDate(): "yesterday" | "today" | "tomorrow" | undefined {
    const value = this.value()
    const yesterday = DateTime.yesterday().value()
    const today = DateTime.today().value()
    if (yesterday <= value && value < today) {
      return "yesterday"
    }
    const tomorrow = DateTime.tomorrow().value()
    if (today <= value && value < tomorrow) {
      return "today"
    }
    if (tomorrow <= value && value < DateTime.now().offset({ days: 2 }).midnight().value()) {
      return "tomorrow"
    }
    return undefined
  }

  /** Returns a new DateTime offset by the given time increments */
  public offset({
    days,
    weeks,
    months,
    years,
  }: {
    days?: number
    weeks?: number
    months?: number
    years?: number
  }): DateTime {
    const date = this._date
    if (years) {
      date.setFullYear(date.getFullYear() + years)
    }
    if (months) {
      date.setMonth(date.getMonth() + months)
    }
    let value = date.valueOf()
    value += (weeks ?? 0) * DateTime._oneDayMilliseconds * 7
    value += (days ?? 0) * DateTime._oneDayMilliseconds
    return new DateTime(value)
  }

  /** Returns a fully formatted date and time, including relative date for today/yesterday/tomorrow */
  public format(): string {
    const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" })
    const timeFormatter = new Intl.DateTimeFormat("en-US", { timeStyle: "short" })
    const day = this.relativeDate() ?? dateFormatter.format(this._date)
    const time = timeFormatter.format(this._date)
    return `${capitalize(day)} at ${time}`
  }

  /** Returns the relative amount of time between this DateTime and the current time */
  public since(): string {
    const time = this._date.getTime()
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

  // Returns the day and month as a string, e.g. 7/17
  public dayAndMonth(): string {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "numeric",
    }).format(this._date)
  }

  public static *range(start: DateTime, end: DateTime) {
    let current = start
    while (current.value() < end.value()) {
      yield current
      current = current.offset({ days: 1 })
    }
  }
}
