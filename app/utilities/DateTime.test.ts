import { describe, it, expect, vi, beforeEach } from "vitest"
import { DateTime } from "./DateTime"

describe("DateTime", () => {
  describe("constructor", () => {
    it("accepts zero parameters", () => {
      vi.setSystemTime("7/4/2024")
      const dateTime = new DateTime()
      expect(dateTime.value()).toEqual(1720069200000)
    })

    it("accepts a date object", () => {
      const dateTime = new DateTime(new Date(1720280924720))
      expect(dateTime.value()).toEqual(1720280924720)
    })

    it("accepts a string", () => {
      const dateTime = new DateTime("Sat Jul 06 2024 10:48:44")
      expect(dateTime.value()).toEqual(1720280924000)
    })

    it("accepts a number", () => {
      const dateTime = new DateTime(1720280924720)
      expect(dateTime.value()).toEqual(1720280924720)
    })
  })

  describe("now", () => {
    it("creates a datetime with the current time", () => {
      vi.setSystemTime(1720490352000)
      const dateTime = DateTime.now()
      expect(dateTime.value()).toEqual(1720490352000)
    })
  })

  describe("today", () => {
    it("returns the current day at midnight", () => {
      vi.setSystemTime("Mon Jul 08 2024 20:59:12")
      const today = DateTime.today()
      expect(today.value()).toEqual(new Date("7/8/24").valueOf())
    })
  })

  describe("yesterday", () => {
    it("returns the day before the current day, at midnight", () => {
      vi.setSystemTime("Mon Jul 08 2024 20:59:12")
      const yesterday = DateTime.yesterday()
      expect(yesterday.value()).toEqual(new Date("7/7/24").valueOf())
    })
  })

  describe("tomorrow", () => {
    it("returns the day after the current day, at midnight", () => {
      vi.setSystemTime("Mon Jul 08 2024 20:59:12")
      const tomorrow = DateTime.tomorrow()
      expect(tomorrow.value()).toEqual(new Date("7/9/24").valueOf())
    })
  })

  describe("dayOfWeek", () => {
    it("returns the correct day of the week", () => {
      const sundayJuly7th = new DateTime("7/7/24")
      const mondayJuly8th = new DateTime("7/8/24")
      const tuesdayJuly9th = new DateTime("7/9/24")
      const wednesdayJuly10th = new DateTime("7/10/24")
      const thursdayJuly11th = new DateTime("7/11/24")
      const fridayJuly12th = new DateTime("7/12/24")
      const saturdayJuly13th = new DateTime("7/13/24")

      expect(sundayJuly7th.dayOfWeek()).toEqual("Sunday")
      expect(mondayJuly8th.dayOfWeek()).toEqual("Monday")
      expect(tuesdayJuly9th.dayOfWeek()).toEqual("Tuesday")
      expect(wednesdayJuly10th.dayOfWeek()).toEqual("Wednesday")
      expect(thursdayJuly11th.dayOfWeek()).toEqual("Thursday")
      expect(fridayJuly12th.dayOfWeek()).toEqual("Friday")
      expect(saturdayJuly13th.dayOfWeek()).toEqual("Saturday")
    })
  })

  describe("midnight", () => {
    it("returns the same day, but with the time set to midnight", () => {
      const july8thWithTime = new DateTime("Mon Jul 08 2024 20:59:12")
      const july8thMidnight = july8thWithTime.midnight()
      expect(july8thMidnight.value()).toEqual(new Date("7/8/24").valueOf())
    })
  })

  describe("relativeDate", () => {
    beforeEach(() => {
      vi.setSystemTime(1720490352037)
    })

    it("returns yesterday correctly", () => {
      const yesterday = DateTime.yesterday()
      expect(yesterday.relativeDate()).toEqual("yesterday")
    })

    it("returns today correctly", () => {
      const today = DateTime.today()
      expect(today.relativeDate()).toEqual("today")
    })

    it("returns tomorrow correctly", () => {
      const tomorrow = DateTime.tomorrow()
      expect(tomorrow.relativeDate()).toEqual("tomorrow")
    })

    it("returns undefined for other dates", () => {
      const twoDaysFromNow = DateTime.now().offset({ days: 2 })
      const twoDaysAgo = DateTime.now().offset({ days: -2 })

      expect(twoDaysFromNow.relativeDate()).toBe(undefined)
      expect(twoDaysAgo.relativeDate()).toBe(undefined)
    })
  })

  describe("offset", () => {
    it("adds a number of days", () => {
      const july7th = new DateTime("7/7/24")
      const july29th = july7th.offset({ days: 22 })

      expect(july29th.date()).toEqual(new Date("7/29/24").toLocaleDateString())
    })

    it("adds a number of weeks", () => {
      const july7th = new DateTime("7/7/24")
      const august18th = july7th.offset({ weeks: 6 })

      expect(august18th.date()).toEqual(new Date("8/18/24").toLocaleDateString())
    })

    it("adds a number of months", () => {
      const july7th = new DateTime("7/7/24")
      const september7th = july7th.offset({ months: 2 })

      expect(september7th.date()).toEqual(new Date("9/7/24").toLocaleDateString())
    })

    it("adds a number of years", () => {
      const july7th = new DateTime("7/7/24")
      const inFiveYears = july7th.offset({ years: 5 })

      expect(inFiveYears.date()).toEqual(new Date("7/7/29").toLocaleDateString())
    })
  })

  describe("format", () => {
    it("formats a date and time with relative day", () => {
      vi.setSystemTime("Mon Jul 08 2024 20:59:12")
      const dateTime = new DateTime("Mon Jul 08 2024 20:59:12")
      expect(dateTime.format()).toEqual("Today at 8:59 PM")
    })

    it("formats a date and time without relative day", () => {
      vi.setSystemTime("7/2/2024")
      const dateTime = new DateTime("Mon Jul 08 2024 20:59:12")
      expect(dateTime.format()).toEqual("July 8, 2024 at 8:59 PM")
    })
  })

  describe("since", () => {
    it("formats seconds ago", () => {
      vi.setSystemTime("Wed Jul 10 2024 21:12:33")
      const dateTime = new DateTime("Wed Jul 10 2024 21:12:29")
      expect(dateTime.since()).toEqual("4 seconds ago")
    })

    it("formats minutes ago", () => {
      vi.setSystemTime("Wed Jul 10 2024 21:09:08")
      const twoMinutesAgo = new DateTime("Wed Jul 10 2024 21:06:44")
      expect(twoMinutesAgo.since()).toEqual("2 minutes ago")
    })

    it("formats hours ago", () => {
      vi.setSystemTime("Wed Jul 10 2024 21:12:29")
      const fiveHoursAgo = new DateTime("Wed Jul 10 2024 16:12:29")
      expect(fiveHoursAgo.since()).toEqual("5 hours ago")
    })

    it("formats yesterday", () => {
      vi.setSystemTime("7/10/24")
      const yesterday = new DateTime("7/9/24")
      expect(yesterday.since()).toEqual("yesterday")
    })

    it("formats days ago", () => {
      vi.setSystemTime("7/10/24")
      const threeDaysAgo = new DateTime("7/7/24")
      expect(threeDaysAgo.since()).toEqual("3 days ago")
    })

    it("formats last week", () => {
      vi.setSystemTime("7/10/24")
      const lastWeek = new DateTime("7/2/24")
      expect(lastWeek.since()).toEqual("last week")
    })

    it("formats weeks ago", () => {
      vi.setSystemTime("7/10/24")
      const twoWeeksAgo = new DateTime("6/26/24")
      expect(twoWeeksAgo.since()).toEqual("2 weeks ago")
    })

    it("formats last month", () => {
      vi.setSystemTime("7/10/24")
      const lastMonth = new DateTime("6/5/24")
      expect(lastMonth.since()).toEqual("last month")
    })

    it("formats months ago", () => {
      vi.setSystemTime("7/10/24")
      const sevenMonthsAgo = new DateTime("12/4/23")
      expect(sevenMonthsAgo.since()).toEqual("7 months ago")
    })

    it("formats last year", () => {
      vi.setSystemTime("7/10/24")
      const lastYear = new DateTime("6/4/23")
      expect(lastYear.since()).toEqual("last year")
    })

    it("formats years ago", () => {
      vi.setSystemTime("7/10/24")
      const nineYearsAgo = new DateTime("4/2/15")
      expect(nineYearsAgo.since()).toEqual("9 years ago")
    })
  })
})
