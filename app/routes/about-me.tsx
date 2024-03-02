import Icon from "~/components/Icon"
import profileImage from "~/images/profile.jpg"
import capitolImage from "~/images/capitol-square.jpg"
import epicCassImage from "~/images/epic-cass.jpg"
import useSetRootProperty from "~/hooks/useSetRootProperty"
import { MetaFunction } from "@remix-run/node"
import EpicLogo from "~/svg/EpicLogo"

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | About Me" },
    { name: "description", content: "This is an about me page" },
  ]
}

export default function AboutMe() {
  useSetRootProperty("--about-hero-image", `url(${capitolImage})`)

  return (
    <>
      <div className="w-full items-center flex-col gap-4 bg-surface-bg px-4">
        <div
          id="mainHeader"
          className="about-hero-image w-full h-[200px] object-cover bg-cover bg-center absolute"
        />
        <h1 className="z-[2] text-white mt-8 mb-4 text-5xl font-bold">About Me</h1>
        <div className="w-full max-w-3xl min-h-4 rounded-[4px] overflow-hidden flex flexible gap-6 z-[2] bg-surface p-4 shadow-md">
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
              mine. I studied Music Education at UW Milwaukee and was a teacher for a year before I
              discovered and fell in love with programming. Just 7 months after writing my first
              line of code, I had taught myself enough to land a new job as a Software Developer at
              Epic.
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
        </div>
        <div className="w-full max-w-3xl min-h-4 rounded-[4px] overflow-hidden bg-surface shadow-md">
          <div className="relative">
            <img src={epicCassImage} className="object-cover h-[150px] block w-full absolute" />
          </div>
          <div className="z-[2] relative top-[90px] mb-[90px] px-8">
            <div className="flex h-[128px] w-[128px] p-2 rounded-md bg-white shadow-md">
              <EpicLogo />
            </div>
          </div>
          <div className="py-4 px-8">
            <p className="text-lg font-medium">Software Developer | Epic</p>
            {/* TODO: calculate time at job */}
            <p className="labelColor">July 2021 - Present • 2 yrs 9 months</p>
          </div>
        </div>
      </div>
    </>
  )
}
