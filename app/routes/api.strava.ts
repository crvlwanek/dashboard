import { LoaderFunction } from "@remix-run/node"
import { fetchRecentActivity, setRecentActivity } from "~/integrations/MongoDB"
import Strava, {
  StravaPolylineMap,
  StravaSummaryActivity,
  StravaTokenData,
} from "~/integrations/Strava"
import env from "~/utilities/env"

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
    | "id"
  > &
    Pick<StravaPolylineMap, "summary_polyline">
}

export interface CachedStravaData extends StravaTokenData, ProcessedActivityData {
  /** A timestamp representing when we last fetched activity data from Strava */
  updated: number
}

const strava = new Strava(env.get("STRAVA_CLIENT_ID"), env.get("STRAVA_CLIENT_SECRET"))

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
  return loadStravaData()
}

// Not currently used but exporting
export const getAuthCode = () => {
  strava.authorize()
}

// Gets access token token
export const getAccessToken = async (authCode: string) => {
  const res = await strava.getAccessToken(authCode)
  const content = await res.json()
  console.log(content)
  return content
}

const loadStravaData = async () => {
  const data = await fetchRecentActivity()
  const id = data._id
  // If it's been updated in the last 5 minutes, just return the data
  if (data.updated > Date.now() - 1000 * 60 * 5) {
    return createResponse(data)
  }
  if (data.expires_at < Date.now()) {
    const tokenResponse = await strava.refreshTokens(data.refresh_token)
    if (strava.isError(tokenResponse)) {
      console.error(tokenResponse)
      throw new Error("Error refreshing Strava token")
    }

    data.expires_at = tokenResponse.expires_at * 1000
    data.refresh_token = tokenResponse.refresh_token
    data.access_token = tokenResponse.access_token
  }
  const activitiesResponse = await strava.getActivities(data.access_token)
  if (strava.isError(activitiesResponse)) {
    console.error(activitiesResponse)
    throw new Error("Error retrieving activity data")
  }
  const newData = processActivityData(activitiesResponse, data)
  // Don't need to await this, just storing it back to the database
  setRecentActivity(id, newData)
  return createResponse(newData)
}

const requestRefresh = async () => {
  const data = await fetchRecentActivity()
  const tokens = await strava.refreshTokens(data.refresh_token)
  return tokens
}

const processActivityData = (
  activities: StravaSummaryActivity[],
  cachedData: StravaTokenData
): CachedStravaData => {
  const { access_token, refresh_token, expires_at } = cachedData
  const mostRecentActivity = activities[0]
  const { name, distance, moving_time, type, average_speed, start_date, average_heartrate, id } =
    mostRecentActivity
  const { summary_polyline } = mostRecentActivity.map
  const output = {
    updated: Date.now(),
    most_recent_activity: {
      name,
      distance,
      moving_time,
      type,
      average_speed,
      start_date,
      summary_polyline,
      average_heartrate,
      id,
    },
    access_token,
    refresh_token,
    expires_at,
  }
  return output
}

const createResponse = (data: CachedStravaData): ProcessedActivityData => {
  return {
    most_recent_activity: data.most_recent_activity,
  }
}
