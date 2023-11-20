import { type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import Avatar from "~/components/Avatar"
import IconButton from "~/components/IconButton"
import { ProcessedActivityData } from "./api.strava"
import StravaActivity from "~/components/StravaActivity"
import { GitHub } from "~/integrations/GitHub"

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Chris Van Lanen-Wanek" }, { name: "description", content: "Welcome to my dashboard" }]
}

export const loader = async ({ request }: { request: Request }) => {
  const repos = await GitHub.listUserRepos("crvlwanek")
  const res = await fetch(`${request.url}api/strava`)
  const stravaData: ProcessedActivityData = await res.json()
  return stravaData
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
      <div>
        <div
          style={{
            maxWidth: 800,
            margin: "auto",
            padding: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <StravaActivity activity={data.most_recent_activity} />
        </div>
      </div>
    </>
  )
}
