import { capitalize } from "./converters"

export class DateTime {
  private static _oneDayMilliseconds: number = 86_400_000

  public static yesterday({ midnight } = { midnight: true }): Date {
    const date = new Date(Date.now() - this._oneDayMilliseconds)
    return midnight ? this.setMidnight(date) : date
  }

  public static today({ midnight } = { midnight: true }): Date {
    const date = new Date()
    return midnight ? this.setMidnight(date) : date
  }

  public static tomorrow({ midnight } = { midnight: true }): Date {
    const date = new Date(Date.now() + this._oneDayMilliseconds)
    return midnight ? this.setMidnight(date) : date
  }

  public static setMidnight(date: Date): Date {
    date.setHours(0, 0, 0, 0)
    return date
  }

  public static getRelativeDate(date: Date): "yesterday" | "today" | undefined {
    const yesterday = this.yesterday()
    const today = this.today()
    if (yesterday <= date && date < today) {
      return "yesterday"
    }
    if (today <= date && date < this.tomorrow()) {
      return "today"
    }
    return undefined
  }

  public static formatDateTimeFull(date: Date): string {
    const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" })
    const timeFormatter = new Intl.DateTimeFormat("en-US", { timeStyle: "short" })
    const day = this.getRelativeDate(date) ?? dateFormatter.format(date)
    const time = timeFormatter.format(date)
    return `${capitalize(day)} at ${time}`
  }

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
}
