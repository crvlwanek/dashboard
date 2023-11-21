import { LoaderFunction, json } from "@remix-run/node"
import MapBox from "~/integrations/MapBox"
import Pantry from "~/integrations/Pantry"
import Strava, {
  StravaPolylineMap,
  StravaSummaryActivity,
  StravaTokenData,
} from "~/integrations/Strava"

export type ProcessedActivityData = {
  /** Most recent activity on Strava */
  most_recent_activity: Pick<
    StravaSummaryActivity,
    | "name"
    | "distance"
    | "moving_time"
    | "type"
    | "average_speed"
    | "start_date"
    | "average_heartrate"
  > &
    Pick<StravaPolylineMap, "summary_polyline">
}

export interface CachedStravaData extends StravaTokenData, ProcessedActivityData {
  /** A timestamp representing when we last fetched activity data from Strava */
  updated: number
}

const mapbox = new MapBox(process.env.MAPBOX_TOKEN)
const strava = new Strava(process.env.STRAVA_CLIENT_ID, process.env.STRAVA_CLIENT_SECRET)
const stravaBasket = new Pantry<CachedStravaData>(
  process.env.PANTRY_ID,
  process.env.NEW_STRAVA_BASKET
)

/**
 * Loads data from Strava, cached every five minutes to avoid API rate limits (100/hr, 1000/day)
 *
 * Step by step breakdown:
 * 1. Load existing data from the database
 * 2. If that data is recent (within last 5 minutes) just return the data
 * 3. Check the expiration on access token. If expired, request a new one using refresh token
 * 4. Retrive new data from Strava endpoint
 * 5. Process that data
 * 6. Save the result (plus tokens and updated timestamp) back to the database
 * 7. Return the newly processed data
 *
 * @returns JSON, either the processed activity data (if successful) or an error if one was encountered
 */
export const loader: LoaderFunction = async () => {
  const data = await stravaBasket.get()
  const mapboxResponse = await mapbox.getStaticImage(data.most_recent_activity.summary_polyline)
  if (data.updated > Date.now() - 1000 * 60 * 5) {
    return createResponse(data)
  }
  if (data.expires_at < Date.now()) {
    const tokenResponse = await strava.refreshTokens(data.refresh_token)
    if (strava.isError(tokenResponse)) {
      console.error(tokenResponse)
      return json({ error: "Error refreshing Strava token" }, { status: 500 })
    }

    data.expires_at = tokenResponse.expires_at * 1000
    data.refresh_token = tokenResponse.refresh_token
    data.access_token = tokenResponse.access_token
  }
  const activitiesResponse = await strava.getActivities(data.access_token)
  if (strava.isError(activitiesResponse)) {
    console.error(activitiesResponse)
    return json(activitiesResponse, { status: 500 })
  }
  processActivityData(activitiesResponse, data)
  // Don't need to await this, just storing our data back to the database
  stravaBasket.put(data)
  return createResponse(data)
}

const processActivityData = (activities: StravaSummaryActivity[], data: CachedStravaData) => {
  const mostRecentActivity = activities[0]
  const { name, distance, moving_time, type, average_speed, start_date, average_heartrate } =
    mostRecentActivity
  const { summary_polyline } = mostRecentActivity.map
  data.most_recent_activity = {
    name,
    distance,
    moving_time,
    type,
    average_speed,
    start_date,
    summary_polyline,
    average_heartrate,
  }
  data.updated = Date.now()
}

const createResponse = (data: CachedStravaData): ProcessedActivityData => {
  return {
    most_recent_activity: data.most_recent_activity,
  }
}
