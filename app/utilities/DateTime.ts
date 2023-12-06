export class DateTime {
  private static _oneDayMilliseconds: number = 86_400_000

  public static today(): Date {
    const date = new Date()
    return this.setMidnight(date)
  }

  public static yesterday(): Date {
    const date = new Date(Date.now() - this._oneDayMilliseconds)
    return this.setMidnight(date)
  }

  public static setMidnight(date: Date): Date {
    date.setHours(0, 0, 0, 0)
    return date
  }
}
