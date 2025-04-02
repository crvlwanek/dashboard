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
import LargeDividerHeader from "~/components/LargeDividerHeading"
import { ReadingListBook } from "~/implementations/Notion"

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Chris Van Lanen-Wanek" },
    { name: "description", content: "Welcome to my dashboard" },
  ]
}

const getStravaData = async (baseUrl: string): Promise<ProcessedActivityData> => {
  const res = await fetch(`${baseUrl}api/strava`)
  // TODO: This can fail sometimes if the response was a 500
  const data = await res.json()
  return data as ProcessedActivityData
}

interface VolumeResponseWithCurrentPage extends VolumeResponse {
  currentPageNumber?: number
}

const getCurrentBooks = async (): Promise<VolumeResponseWithCurrentPage[]> => {
  const BOOK_DATABASE_ID = "1c66162faf418054969fd5c966ef80b5"
  const notion = new Notion(env.get("NOTION_API_KEY"))
  const notionCurrentBooks = await notion.queryDatabase<ReadingListBook>({
    database_id: BOOK_DATABASE_ID,
    filter: {
      property: "Currently Reading",
      checkbox: {
        equals: true,
      },
    },
  })

  // Error is already logged in the query function
  if (!notionCurrentBooks) return []

  const { results } = notionCurrentBooks
  const currentBooks = results
    .map(result => {
      return {
        volumeId: result.properties.URL.url.split("/").slice(-1)[0],
        currentPageNumber: result.properties["Current Page"].number,
      }
    })
    .filter(x => x)
  const volumeData = await Promise.all(
    currentBooks.map(books => GoogleBooks.getVolume(books.volumeId))
  )

  return volumeData.map(volume => {
    return {
      ...volume,
      currentPageNumber: currentBooks.find(book => book.volumeId === volume.id)?.currentPageNumber,
    }
  })
}

const generateMapUrl = (line: string): string => {
  return MapBox.getStaticImageGeoJson(line, {
    height: 600,
    width: 800,
    stroke: Strava.color,
    strokeWidth: 4,
    padding: "160,30,120,30",
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

const MainHeader = () => {
  return (
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
  )
}

export default function Index() {
  const { activities, repos, bookData } = useLoaderData<typeof loader>()

  const showStrava = true

  return (
    <>
      <MainHeader />
      <div className="max-w-[800px] m-auto p-5 flex justify-center flex-col gap-5 items-center">
        <LargeDividerHeader title="Recent Activity" />
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
