import { useState } from "react"
import Divider from "./Divider"
import Icon from "./Icon"
import { useTheme } from "./ThemeSwitcher"
import useMaxWidth from "~/hooks/useMaxWidth"
import { DateTime } from "~/utilities/DateTime"

// TODO: Factor this out to a feature flag in Notion
const RENDER_TRAINING_INFO = true

type DaysOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
type TrainingPhases = "prep" | "building" | "marathon specific" | "taper"
type RunTypes = "Easy" | "Aerobic" | "Interval"
type TrainingRun = {
  day: DaysOfWeek
  distance: number
  type: RunTypes
}
type TrainingWeek = {
  weekNumber: number
  phase: TrainingPhases
  runs: TrainingRun[]
}
type MarathonPlan = {
  startDate: Date
  weeks: TrainingWeek[]
}

// https://www.baa.org/races/boston-marathon/train/levelfour
export const marathonPlan: MarathonPlan = {
  startDate: new Date("06/24/2024"),
  weeks: [
    {
      weekNumber: 1,
      phase: "prep",
      runs: [
        { day: "Monday", distance: 6, type: "Easy" },
        { day: "Tuesday", distance: 7, type: "Easy" },
        { day: "Wednesday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 13, type: "Easy" },
      ],
    },
    {
      weekNumber: 2,
      phase: "prep",
      runs: [
        { day: "Tuesday", distance: 7, type: "Aerobic" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 5, type: "Aerobic" },
        { day: "Sunday", distance: 13, type: "Aerobic" },
      ],
    },
    {
      weekNumber: 3,
      phase: "prep",
      runs: [
        { day: "Tuesday", distance: 7, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 8, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 14, type: "Interval" },
      ],
    },
    {
      weekNumber: 4,
      phase: "building",
      runs: [
        { day: "Tuesday", distance: 10, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 15, type: "Interval" },
        { day: "Sunday", distance: 10, type: "Easy" },
      ],
    },
    {
      weekNumber: 5,
      phase: "building",
      runs: [
        { day: "Tuesday", distance: 8, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 9, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 16, type: "Aerobic" },
      ],
    },
    {
      weekNumber: 6,
      phase: "building",
      runs: [
        { day: "Tuesday", distance: 8, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 9, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 16, type: "Interval" },
      ],
    },
    {
      weekNumber: 7,
      phase: "building",
      runs: [
        { day: "Tuesday", distance: 7, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 16, type: "Interval" },
        { day: "Sunday", distance: 11, type: "Easy" },
      ],
    },
    {
      weekNumber: 8,
      phase: "building",
      runs: [
        { day: "Tuesday", distance: 8, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 9, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 16, type: "Interval" },
      ],
    },
    {
      weekNumber: 9,
      phase: "building",
      runs: [
        { day: "Tuesday", distance: 8, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 10, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 17, type: "Interval" },
      ],
    },
    {
      weekNumber: 10,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 10, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 18, type: "Interval" },
        { day: "Sunday", distance: 12, type: "Easy" },
      ],
    },
    {
      weekNumber: 11,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 9, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 10, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 18, type: "Interval" },
      ],
    },
    {
      weekNumber: 12,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 9, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 10, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 16, type: "Interval" },
      ],
    },
    {
      weekNumber: 13,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 10, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 14, type: "Interval" },
        { day: "Sunday", distance: 11, type: "Easy" },
      ],
    },
    {
      weekNumber: 14,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 9, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 9, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 18, type: "Interval" },
      ],
    },
    {
      weekNumber: 15,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 10, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 16, type: "Interval" },
        { day: "Sunday", distance: 11, type: "Easy" },
      ],
    },
    {
      weekNumber: 16,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 9, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 12, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 21, type: "Aerobic" },
      ],
    },
    {
      weekNumber: 17,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 10, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 6, type: "Easy" },
        { day: "Friday", distance: 10, type: "Interval" },
        { day: "Saturday", distance: 6, type: "Easy" },
        { day: "Sunday", distance: 22, type: "Interval" },
      ],
    },
    {
      weekNumber: 18,
      phase: "marathon specific",
      runs: [
        { day: "Tuesday", distance: 10, type: "Interval" },
        { day: "Wednesday", distance: 6, type: "Easy" },
        { day: "Thursday", distance: 7, type: "Aerobic" },
        { day: "Friday", distance: 6, type: "Easy" },
        { day: "Saturday", distance: 18, type: "Interval" },
      ],
    },
    {
      weekNumber: 19,
      phase: "taper",
      runs: [
        { day: "Tuesday", distance: 8, type: "Interval" },
        { day: "Wednesday", distance: 5, type: "Easy" },
        { day: "Thursday", distance: 5, type: "Easy" },
        { day: "Friday", distance: 10, type: "Interval" },
        { day: "Saturday", distance: 5, type: "Easy" },
        { day: "Sunday", distance: 11, type: "Easy" },
      ],
    },
    {
      weekNumber: 20,
      phase: "taper",
      runs: [
        { day: "Tuesday", distance: 8, type: "Interval" },
        { day: "Wednesday", distance: 4, type: "Easy" },
        { day: "Thursday", distance: 4, type: "Easy" },
        { day: "Friday", distance: 7, type: "Easy" },
        { day: "Sunday", distance: 3, type: "Easy" },
      ],
    },
  ],
}

interface TrainingRunWithDate extends TrainingRun {
  date: string
}

interface TrainingWeekWithDate extends TrainingWeek {
  runs: TrainingRunWithDate[]
}

class TrainingPlanCalculator {
  /** Override for the current date, used for unit testing and demos */
  private _currentDate?: Date

  private readonly _daysOfWeek: DaysOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  private _getCurrentDate(): Date {
    return this._currentDate ?? new Date()
  }

  public _setCurrentDate(date: Date) {
    this._currentDate = date
  }

  constructor(plan: MarathonPlan) {
    this.startDate = new DateTime(plan.startDate)

    // My way of copying the array
    const days = this._daysOfWeek.map(x => x)
    const startDay = this.startDate.dayOfWeek()
    for (let i = 0; i < 10; i++) {
      if (startDay == days[0]) {
        break
      }
      days.push(days.shift()!)
      if (i === 9) {
        console.log(startDay)
        console.log(days)
        throw new Error(`Something went wrong shifting days. Start day: ${startDay}`)
      }
    }

    this.weeks = plan.weeks.map((week, index) => {
      const firstDayOfWeek = this.startDate.offset({ weeks: index })
      const { weekNumber, phase } = week
      return {
        weekNumber,
        phase,
        runs: week.runs.map(run => {
          const dayIndex = days.indexOf(run.day)
          if (dayIndex === -1) {
            throw new Error(`Could not find day: ${run.day}`)
          }
          return {
            ...run,
            date: firstDayOfWeek.offset({ days: dayIndex }).date(),
          }
        }),
      }
    })
  }

  public weeks: TrainingWeekWithDate[] = []
  public startDate: DateTime = new DateTime()

  /**
   * Based on the start date of the training plan and the current date,
   * returns the index of the current week and day
   */
  public getCurrentWeekAndDay(): { week: number; day: number } {
    const today = new DateTime(this._getCurrentDate())
    let dateIterator = this.startDate.midnight()
    let dayOfWeekIndex = 0
    for (let i = 0; i < this.weeks.length; i++) {
      const week = this.weeks[i]
      for (let j = 0; j < week.runs.length; j++) {
        const run = week.runs[j]
        while (this._daysOfWeek[dayOfWeekIndex] !== run.day) {
          dateIterator = dateIterator.offset({ days: 1 })
          dayOfWeekIndex = (dayOfWeekIndex + 1) % 7
        }
        if (dateIterator.date() === today.date()) {
          return { week: i, day: j }
        }
        if (dateIterator.value() > today.value()) {
          return { week: i, day: -1 }
        }
      }
    }

    return { week: -1, day: -1 }
  }

  /** Returns the total mileage for the entire training plan */
  public getTotalMileage(): number {
    return this.weeks
      .map(TrainingPlanCalculator.getWeeklyMileage)
      .reduce((acc, curr) => acc + curr, 0)
  }
  /** Returns the max mileage of any week in the training plan */
  public getMaxMileage(): number {
    return Math.max(...this.weeks.map(TrainingPlanCalculator.getWeeklyMileage))
  }
  /** Returns the number of weeks in the training plan */
  public getWeekCount(): number {
    return this.weeks.length
  }
  /** Returns the total mileage for a given week */
  public static getWeeklyMileage(week: TrainingWeek): number {
    return week.runs.map(run => run.distance).reduce((acc, curr) => acc + curr, 0)
  }
  /** Returns the week for a given index */
  public getWeek(index: number): TrainingWeekWithDate | undefined {
    if (index < 0 || index > this.weeks.length) {
      return undefined
    }
    return this.weeks[index]
  }
}

const getRunTypeColor = (type: RunTypes, isDarkMode: boolean): string => {
  const typeMap: { [key in RunTypes]: string } = {
    Aerobic: isDarkMode ? "bg-orange-800" : "bg-orange-200",
    Easy: isDarkMode ? "bg-green-800" : "bg-green-200",
    Interval: isDarkMode ? "bg-purple-800" : "bg-purple-200",
  }

  return typeMap[type]
}

const calculator = new TrainingPlanCalculator(marathonPlan)

const MileageByWeek = () => {
  const weekCount = calculator.getWeekCount()
  const maxMileage = calculator.getMaxMileage()
  const increments = [maxMileage, Math.floor(maxMileage) / 2, 0]

  const { week: currentWeekIndex, day: currentDayIndex } = calculator.getCurrentWeekAndDay()

  const theme = useTheme()
  const isDarkMode = theme === "dark"

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(currentWeekIndex)
  const selectedWeek = calculator.getWeek(selectedWeekIndex)

  const isSmallScreen = useMaxWidth(650)

  return (
    <div
      className="w-full bg-surface rounded shadow-md"
      onMouseLeave={() => setSelectedWeekIndex(currentWeekIndex)}
    >
      <div className="pt-2 flex flex-wrap px-4 items-baseline gap-x-2">
        <h2 className="text-xl">Marathon Training Plan</h2>
        <p className="text-xs text-deemp">
          from the{" "}
          <a className="underline" href="https://www.baa.org/races/boston-marathon/train/levelfour">
            Boston Athletic Association
          </a>
        </p>
      </div>
      <p className="labelColor text-sm px-4 text-right">Total: {calculator.getTotalMileage()} mi</p>
      <div className="flex w-full px-4 pt-4">
        <div className="flex flex-col labelColor justify-between text-xs whitespace-nowrap pr-2 py-1">
          {increments.map(inc => (
            <div key={inc}>{inc} mi</div>
          ))}
        </div>
        <div className="flex gap-1 items-end w-full">
          {marathonPlan.weeks.map((week, weekIndex) => {
            const weeklyMileage = TrainingPlanCalculator.getWeeklyMileage(week)
            return (
              <div
                key={week.weekNumber}
                className="bg-primary-main"
                style={{
                  height: `${weeklyMileage * 2.5}px`,
                  width: `${Math.floor(100 / weekCount)}%`,
                  opacity: selectedWeek?.weekNumber === week.weekNumber ? "100%" : "35%",
                }}
                onMouseEnter={() => setSelectedWeekIndex(weekIndex)}
              />
            )
          })}
        </div>
      </div>
      <Divider />
      {selectedWeek && (
        <div className="">
          <h3 className="text-lg px-4 pt-2">
            Week {selectedWeek.weekNumber} · {TrainingPlanCalculator.getWeeklyMileage(selectedWeek)}{" "}
            miles
          </h3>
          <div
            className={"grid p-4 " + (isSmallScreen ? "gap-2" : "")}
            style={{
              gridTemplateColumns: `repeat(${isSmallScreen ? 3 : selectedWeek.runs.length}, 1fr)`,
            }}
          >
            {selectedWeek.runs.map((run, index) => (
              <div
                key={run.day}
                className={
                  "grid place-items-center p-2 relative rounded " +
                  (index === currentDayIndex && selectedWeekIndex === currentWeekIndex
                    ? "outline outline-1 " +
                      (!isDarkMode
                        ? "bg-stone-100 outline-stone-300"
                        : "bg-stone-700 outline-stone-600")
                    : "")
                }
              >
                {index === currentDayIndex && selectedWeekIndex === currentWeekIndex && (
                  <div
                    className={
                      "absolute -top-4 rounded-full px-2 py-1 text-xs " +
                      (!isDarkMode ? "bg-stone-200" : "bg-stone-600")
                    }
                  >
                    Today
                  </div>
                )}
                <div className="labelColor text-sm">
                  {run.day.slice(0, 3) + " " + new DateTime(run.date).dayAndMonth()}
                </div>
                <div className="text-xl font-medium">{run.distance} mi</div>
                <div
                  className={
                    "text-deemph text-xs rounded-full px-4 py-1 mt-2 " +
                    getRunTypeColor(run.type, isDarkMode)
                  }
                >
                  {run.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const TotalMileageMeter = () => {
  const totalMileage = calculator.getTotalMileage()
  return <div className="bg-surface p-4 rounded aspect-square">Total Mileage: {totalMileage}</div>
}

export const MarathonTrainingPlan = () => {
  if (!RENDER_TRAINING_INFO) {
    return
  }

  const theme = useTheme()

  return (
    <>
      <div
        className={`p-4 ${
          theme === "light" ? "bg-slate-200" : "bg-slate-700"
        } rounded flex gap-2 text-sm`}
      >
        <Icon iconKey="info" className="pt-[2px]" />
        <div>
          I'm currently training for the{" "}
          <a className="underline" href="https://madisonmarathon.org/">
            Madison Marathon
          </a>
          ! Check out my progress and most recent run below.
        </div>
      </div>
      <MileageByWeek />
    </>
  )
}
