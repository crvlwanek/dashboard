/** Represents a time duration in milliseconds */
export class Duration {
  /** Private backing field */
  private _value: number

  /** Returns the value of this duration in milliseconds */
  public value(): number {
    return this._value
  }

  /** Creates a duration, value is in milliseconds */
  public constructor(value: number) {
    this._value = value
  }

  /** Returns a new duration based on the difference between now and the given time */
  public static since(date: number): Duration
  public static since(date: string): Duration
  public static since(date: Date): Duration
  public static since(date: Date | number | string): Duration {
    if (typeof date === "number" || typeof date === "string") {
      date = new Date(date)
    }
    return new Duration(Math.abs(Date.now() - date.valueOf()))
  }
}
