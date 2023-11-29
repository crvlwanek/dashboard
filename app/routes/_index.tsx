import { type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import Avatar from "~/components/Avatar"
import IconButton from "~/components/IconButton"
import { ProcessedActivityData } from "./api.strava"
import StravaActivity from "~/components/StravaActivity"
import { GitHub } from "~/integrations/GitHub"
import GitHubRecentRepos from "~/components/GitHubRecentRepos"
import MapBox from "~/integrations/MapBox"
import Strava from "~/integrations/Strava"

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Chris Van Lanen-Wanek" },
    { name: "description", content: "Welcome to my dashboard" },
  ]
}

const getStravaData = async (baseUrl: string): Promise<ProcessedActivityData> => {
  const res = await fetch(`${baseUrl}api/strava`)
  const data = await res.json()
  return data as ProcessedActivityData
}

const generateMapUrl = (line: string): string => {
  return MapBox.getStaticImageGeoJson(line, {
    height: 600,
    width: 800,
    stroke: Strava.color,
    strokeWidth: 4,
    padding: "30,30,140,30",
  })
}

export const loader = async ({ request }: { request: Request }) => {
  const [repos, stravaData] = await Promise.all([
    GitHub.listUserRepos("crvlwanek", { sort: "pushed" }),
    getStravaData(request.url),
  ])

  const mapUrl = generateMapUrl(stravaData.most_recent_activity.summary_polyline)
  return { repos, stravaData, mapUrl }
}

const avatarImage = "https://i.imgur.com/4Ouflwg.jpg"

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <div className="flex align-center justify-center mainHeader">
        <div style={{ position: "relative" }}>
          <Avatar className="chrisAvatar" size={125} src={avatarImage} />
          <img src="https://i.imgur.com/GHLcHKH.png" className="musicIcon" />
        </div>
        <div className="detailBox onImage">
          <div className="header--container">
            <h1 className="header--name">Chris Van Lanen-Wanek</h1>
            <h2 className="header--jobTitle">Software Engineer | Web Developer</h2>
          </div>
          <div className="flex iconBox">
            <IconButton href="https://www.linkedin.com/in/crvlwanek/" iconKey="linkedIn" />
            <IconButton href="https://github.com/crvlwanek" iconKey="github" />
            <IconButton href="https://www.facebook.com/crvlwanek/" iconKey="facebook" />
            <IconButton href="https://www.instagram.com/crvlwanek/" iconKey="instagram" />
            <IconButton href="https://www.youtube.com/c/ChrisVLWanek" iconKey="youtube" />
          </div>
        </div>
      </div>
      <div
        style={{
          maxWidth: 800,
          margin: "auto",
          padding: 20,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
      >
        <StravaActivity activity={data.stravaData.most_recent_activity} mapUrl={data.mapUrl} />
        <GitHubRecentRepos repos={data.repos} repoLimit={7} />
      </div>
    </>
  )
}
