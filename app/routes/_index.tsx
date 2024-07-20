import { Suspense } from "react"
import { defer, type MetaFunction } from "@remix-run/node"
import { Await, useLoaderData } from "@remix-run/react"
import Avatar from "~/components/Avatar"
import { ProcessedActivityData } from "./api.strava"
import StravaActivity from "~/components/StravaActivity"
import { GitHub } from "~/integrations/GitHub"
import GitHubRecentRepos from "~/components/GitHub/GitHubRecentRepos"
import MusicLogo from "~/svg/MusicLogo"
import MapBox from "~/integrations/MapBox"
import Strava from "~/integrations/Strava"
import StravaSkeleton from "~/components/StravaSkeleton"
import GitHubSkeleton from "~/components/GitHub/GitHubSkeleton"
import SocialIconBar from "~/components/SocialIconBar"
import { ErrorBoundary } from "~/components/ErrorBoundary"
import avatarImage from "~/images/sunflowers.jpg"
import ErrorBox from "~/common/components/ErrorBox"
import Notion from "~/integrations/Notion"
import env from "~/utilities/env"
import GoogleBooks, { VolumeResponse } from "~/integrations/GoogleBooks"
import CurrentBooks from "~/components/CurrentBooks"
import { MarathonTrainingPlan } from "~/components/MarathonTrainingPlan"
import LargeDividerHeader from "~/components/LargeDividerHeading"

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

const getCurrentBooks = async (): Promise<VolumeResponse[]> => {
  const notion = new Notion(env.get("NOTION_API_KEY"))
  const notionData = await notion.retrieveBlockChildren("79eaeded2684425d9d679ebdd09fe3b2")
  const bookURLs = Notion.getParagraphs(notionData)
  const volumeIds = bookURLs.map(url => url.split("/").slice(-1)[0])
  const data = await Promise.all(volumeIds.map(id => GoogleBooks.getVolume(id)))
  return data
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

type StravaAndMap = {
  stravaData: ProcessedActivityData
  mapUrl: string
}

const getStravaAndMap = async (baseUrl: string): Promise<StravaAndMap> => {
  const stravaData = await getStravaData(baseUrl)
  const mapUrl = generateMapUrl(stravaData.most_recent_activity.summary_polyline)
  return { stravaData, mapUrl }
}

export const loader = async ({ request }: { request: Request }) => {
  const activities = getStravaAndMap(request.url)
  const repos = GitHub.listUserRepos("crvlwanek", { sort: "pushed" })
  const bookData = getCurrentBooks()
  return defer({ activities, repos, bookData })
}

export default function Index() {
  const { activities, repos, bookData } = useLoaderData<typeof loader>()

  const showStrava = true

  return (
    <>
      <div id="mainHeader" className="flex align-center justify-center mainHeader">
        <div className="relative flex-shrink-0">
          <Avatar className="chrisAvatar" size={125} src={avatarImage} />
          <div className="chrisAvatarBorder"></div>
          <MusicLogo className="musicIcon animate" />
          <MusicLogo className="musicIcon animate blur" />
        </div>
        <div className="detailBox onImage">
          <div className="header--container">
            <h1 className="header--name">Chris Van Lanen-Wanek</h1>
            <h2 className="header--jobTitle">Software Engineer | Web Developer</h2>
          </div>
          <SocialIconBar />
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
        <LargeDividerHeader title="Running Activity" />
        <ErrorBoundary
          fallback={<ErrorBox>Unable to load marathon training plan, try again later</ErrorBox>}
        >
          <MarathonTrainingPlan />
        </ErrorBoundary>
        {showStrava && (
          <ErrorBoundary
            fallback={<ErrorBox>Unable to load Strava data, try again later</ErrorBox>}
          >
            <Suspense fallback={<StravaSkeleton />}>
              <Await resolve={activities}>
                {activities => (
                  <StravaActivity
                    activity={activities.stravaData.most_recent_activity}
                    mapUrl={activities.mapUrl}
                  />
                )}
              </Await>
            </Suspense>
          </ErrorBoundary>
        )}
        <LargeDividerHeader title="Other Activity" />
        <ErrorBoundary fallback={<ErrorBox>Unable to load GitHub data, try again later</ErrorBox>}>
          <Suspense fallback={<GitHubSkeleton repoLimit={7} />}>
            <Await resolve={repos}>
              {repos => <GitHubRecentRepos repos={repos} repoLimit={7} />}
            </Await>
          </Suspense>
        </ErrorBoundary>
        <CurrentBooks data={bookData} />
      </div>
    </>
  )
}
