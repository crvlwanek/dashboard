import { describe, expect, it, vi } from "vitest"
import { Duration } from "./Duration"

describe("Duration", () => {
  describe("constructor", () => {
    it("accepts a number as a parameter", () => {
      const duration = new Duration(3000)
      expect(duration.value()).toEqual(3000)
    })
  })

  describe("since", () => {
    it("accepts a date as a parameter", () => {
      vi.setSystemTime(1720499875125)
      const fourSeconds = Duration.since(new Date(1720499871125))
      expect(fourSeconds.value()).toEqual(4000)
    })

    it("accepts a number as a parameter", () => {
      vi.setSystemTime(1720499875125)
      const fourSeconds = Duration.since(1720499871125)
      expect(fourSeconds.value()).toEqual(4000)
    })

    it("accepts a string as a parameter", () => {
      vi.setSystemTime(1720499875000)
      const fourSeconds = Duration.since(
        "Mon Jul 08 2024 23:37:51 GMT-0500 (Central Daylight Time)"
      )
      expect(fourSeconds.value()).toEqual(4000)
    })
  })
})
