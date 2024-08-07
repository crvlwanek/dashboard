import Icon from "~/components/Icon"
import profileImage from "~/images/profile.jpg"
import capitolImage from "~/images/capitol-square.jpg"
import epicCassImage from "~/images/epic-cass.jpg"
import useSetRootProperty from "~/hooks/useSetRootProperty"
import { MetaFunction } from "@remix-run/node"
import EpicLogo from "~/svg/EpicLogo"
import { DateTime } from "~/utilities/DateTime"
import LargeDividerHeader from "~/components/LargeDividerHeading"
import Card from "~/common/components/Card"

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | About Me" },
    { name: "description", content: "This is an about me page" },
  ]
}

export default function AboutMe() {
  useSetRootProperty("--about-hero-image", `url(${capitolImage})`)

  // Tenure at Epic
  const { years, months } = DateTime.yearMonthDifference(new Date(2021, 6, 1), new Date())
  const epicTenure = `${years} years ${months ? months.toString() + " months" : ""}`

  return (
    <>
      <div className="w-full items-center flex-col gap-4 bg-surface-bg px-4">
        <div
          id="mainHeader"
          className="about-hero-image w-full h-[200px] object-cover bg-cover bg-center absolute"
        />
        <h1 className="z-[2] text-white mt-8 mb-4 text-5xl font-bold">About Me</h1>
        <div className="max-w-3xl z-[2]">
          <Card className="w-full min-h-4 overflow-hidden flex flexible gap-6 p-4">
            <img
              src={profileImage}
              className="aspect-square object-cover rounded-full w-[300px] self-start mx-auto border-solid border-4 border-white"
            />
            <div className="flex-col gap-4">
              <p className="text-lg">Hi, my name is Chris!</p>
              <p className="text-2xl">
                I'm a <b>software developer</b>, <b>musician</b>, and a{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.youtube.com/watch?v=oxgwDdFJZbA"
                  className="text-primary-main hover:underline"
                >
                  hybrid athelete
                </a>
                .
              </p>
              <p>
                Since the day I started playing violin at age 3, music has always been a passion of
                mine. I studied Music Education at UW Milwaukee and was a teacher for a year before
                I discovered and fell in love with programming. Just 7 months after writing my first
                line of code, I had taught myself enough to land a new job as a Software Developer
                at Epic.
              </p>
              <p>
                In my free time, I enjoy lifting weights, distance running, and learning more about
                programming.
              </p>
              <div>
                <div className="labelColor  flex align-center gap-2">
                  <Icon iconKey="weightlifting" />
                  Max deadlift: 345lbs
                </div>
                <div className="labelColor  flex align-center gap-2">
                  <Icon iconKey="shoe" className="inline" />
                  Fastest marathon: 3h 52m
                </div>
              </div>
            </div>
          </Card>
          <LargeDividerHeader title="Work Experience" />
          <Card className="w-full min-h-4 overflow-hidden">
            <div className="relative">
              <img src={epicCassImage} className="object-cover h-[150px] block w-full absolute" />
            </div>
            <div className="z-[2] relative top-[50px] mb-[50px] px-6">
              <div className="flex h-[128px] w-[128px] p-2 rounded-md bg-white shadow-md">
                <EpicLogo />
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-end gap-x-2">
                <p className="text-lg font-medium">Software Developer | Epic</p>
                <p className="labelColor"> • Verona, Wisconsin</p>
              </div>
              <p className="labelColor text-sm">July 2021 - Present • {epicTenure}</p>
              <p className="mt-1">
                Fullstack developer creating a web-based application for creating and maintaining
                electronic medical records.
              </p>
              {/* TODO: add accordion for this info */}
              <ul className="list-disc pl-5">
                {/* TODO: better descriptions */}
                <li>
                  Leads development projects: currently working on a project to merge duplicate
                  diagnosis data in the patient's chart.
                </li>
                <li>
                  Teaches and leads other developers through organizing dev meetings on technical
                  topics, grading internal training assignments, conducting interviews, and being a
                  1-on-1 mentor for new hires.
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
