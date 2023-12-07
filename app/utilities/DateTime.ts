import { capitalize } from "./converters"

export class DateTime {
  private static _oneDayMilliseconds: number = 86_400_000

  public static today({ midnight } = { midnight: true }): Date {
    const date = new Date()
    return midnight ? this.setMidnight(date) : date
  }

  public static tomorrow({ midnight } = { midnight: true }): Date {
    const date = new Date(Date.now() + this._oneDayMilliseconds)
    return midnight ? this.setMidnight(date) : date
  }

  public static yesterday({ midnight } = { midnight: true }): Date {
    const date = new Date(Date.now() - this._oneDayMilliseconds)
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
}
