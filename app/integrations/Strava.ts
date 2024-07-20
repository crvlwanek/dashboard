export default class Strava {
  private _clientId: string
  private _clientSecret: string

  public static readonly color = "#fc4c02"
  public static readonly activitiesUrl = "https://www.strava.com/activities/"
  private static readonly _tokenUrl = "https://www.strava.com/api/v3/oauth/token"

  public constructor(clientId?: string, clientSecret?: string) {
    if (!clientId || !clientSecret) {
      throw new Error("Missing Strava clientId or clientSecret")
    }

    this._clientId = clientId
    // I have no idea why but there's a whitespace character at the end of this env variable
    this._clientSecret = clientSecret.trimEnd()
  }

  // Use this to generate a URL for gaining an accees code
  public async authorize() {
    const redirectUri = "http://localhost:3000/about"
    const scope = "activity:read"

    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${
      this._clientId
    }&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(
      scope
    )}`

    console.log(authorizationUrl)
  }

  public async getAccessToken(authCode: string) {
    const redirect_uri = "http://localhost:3000/about"
    const scope = "activity:read"

    const url = Strava._tokenUrl
    const params = new URLSearchParams({
      client_id: this._clientId,
      client_secret: this._clientSecret,
      code: authCode,
      grant_type: "authorization_code",
      redirect_uri,
      scope,
    })

    const res = fetch(url, { method: "POST", body: params })
    return res
  }

  public async refreshTokens(refreshToken: string): Promise<StravaTokenData | StravaFault> {
    const scope = "activity:read"

    const url = Strava._tokenUrl
    const params = new URLSearchParams()
    params.append("client_id", this._clientId)
    params.append("client_secret", this._clientSecret)
    params.append("refresh_token", refreshToken)
    params.append("grant_type", "refresh_token")
    params.append("scope", scope)
    const response = await fetch(url, { method: "POST", body: params })
    return response.json()
  }

  public async getActivities(accessToken: string): Promise<StravaSummaryActivity[] | StravaFault> {
    const url = `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}`
    const response = await fetch(url)
    return response.json()
  }

  public isError(response: any): response is StravaFault {
    return !!response?.errors
  }
}

/**
 * Strava interface for activity data
 *
 * For more info see: https://developers.strava.com/playground/#/Activities/getLoggedInAthleteActivities
 */
export type StravaSummaryActivity = {
  /** The unique identifier of the activity */
  id: number
  /** The identifier provided at upload time */
  external_id: string
  /** The identifier of the upload that resulted in this activity */
  upload_id: number
  athlete: {
    id: number
  }
  /** The name of the activity */
  name: string
  /** The activity's distance, in meters (float) */
  distance: number
  /** The activity's moving time, in seconds (integer) */
  moving_time: number
  /** The activity's moving time, in seconds (integer) */
  elapsed_time: number
  /** The activity's total elevation gain (float) */
  total_elevation_gain: number
  /** The activity's highest elevation, in meters (float) */
  elev_high: number
  /** The activity's lowest elevation, in meters (float) */
  elev_low: number
  /** An enumeration of activity types (see docs for full list) */
  type: string
  /** An enumeration of sport types (see docs for full list) */
  sport_type: string
  /** The time at which the activity was started (datetime) */
  start_date: string
  /** The time at which the activity was started, in the local timezone (datetime) */
  start_date_local: string
  /** The timezone of the activity */
  timezone: string
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floats */
  start_latlng: [number, number]
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floats */
  end_latlng: [number, number]
  /** The number of achievements gained during this activity */
  achievement_count: number
  /** The number of kudos given for this activity */
  kudos_count: number
  /** The number of comments for this activity */
  comment_count: number
  /** The number of athletes for taking part in a group activity (miniumum 1) */
  athlete_count: number
  /** The number of Instagram photos for this activity */
  photo_count: number
  /** The number of Instagram and Strava photos for this activity */
  total_photo_count: number
  map: StravaPolylineMap
  /** Whether this activity was recorded on a training machine */
  trainer: boolean
  /** Whether this activity is a commute */
  commute: boolean
  /** Whether this activity was created manually */
  manual: boolean
  /** Whether this activity is private */
  private: boolean
  /** Whether this activity is flagged */
  flagged: boolean
  /** The activity's workout type */
  workout_type: number
  /** The unique identifier of the upload in string format */
  upload_id_str: string
  /** The activity's average speed, in meters per second (float) */
  average_speed: number
  /** The activity's max speed, in meters per second (float) */
  max_speed: number
  /** The id of the gear for the activity */
  gear_id: string
  /** The average heartrate during this activity */
  average_heartrate?: number
}

export type StravaPolylineMap = {
  /** The identifier of the map */
  id: string
  /** The polyline of the map, only returned on detailed representation of an object */
  polyline?: string
  /** The summary polyline of the map */
  summary_polyline: string
}

export type StravaFault = {
  errors: [
    {
      code: string
      field: string
      resource: string
    },
  ]
  message: string
}

// Type representing the token data we recieve from Strava
export type StravaTokenData = {
  /** A Strava access token used for requesting data */
  access_token: string
  /** A Strava refresh token, used to request a new access/refresh token */
  refresh_token: string
  /**
   * A timestamp of when the access token expires, if expired use refresh token to request new tokens
   *
   * IMPORTANT: Strava returns this in a different format (seconds rather than milliseconds) so we convert it
   * before saving it back to the database
   */
  expires_at: number
}
