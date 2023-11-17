import { LoaderFunction, json } from "@remix-run/node";

/**
 * Strava interface for activity data
 *
 * For more info see: https://developers.strava.com/playground/#/Activities/getLoggedInAthleteActivities
 */
export interface StravaActivity {
  /** The unique identifier of the activity */
  id: number;
  /** The identifier provided at upload time */
  external_id: string;
  /** The identifier of the upload that resulted in this activity */
  upload_id: number;
  athlete: {
    id: number;
  };
  /** The name of the activity */
  name: string;
  /** The activity's distance, in meters (float) */
  distance: number;
  /** The activity's moving time, in seconds (integer) */
  moving_time: number;
  /** The activity's moving time, in seconds (integer) */
  elapsed_time: number;
  /** The activity's total elevation gain (float) */
  total_elevation_gain: number;
  /** The activity's highest elevation, in meters (float) */
  elev_high: number;
  /** The activity's lowest elevation, in meters (float) */
  elev_low: number;
  /** An enumeration of activity types (see docs for full list) */
  type: string;
  /** An enumeration of sport types (see docs for full list) */
  sport_type: string;
  /** The time at which the activity was started (datetime) */
  start_date: string;
  /** The time at which the activity was started, in the local timezone (datetime) */
  start_date_local: string;
  /** The timezone of the activity */
  timezone: string;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floats */
  start_latlng: [number, number];
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floats */
  end_latlng: [number, number];
  /** The number of achievements gained during this activity */
  achievement_count: number;
  /** The number of kudos given for this activity */
  kudos_count: number;
  /** The number of comments for this activity */
  comment_count: number;
  /** The number of athletes for taking part in a group activity (miniumum 1) */
  athlete_count: number;
  /** The number of Instagram photos for this activity */
  photo_count: number;
  /** The number of Instagram and Strava photos for this activity */
  total_photo_count: number;
  map: {
    /** The identifier of the map */
    id: string;
    /** The polyline of the map, only returned on detailed representation of an object */
    polyline: string;
    /** The summary polyline of the map */
    summary_polyline: string;
  };
  /** Whether this activity was recorded on a training machine */
  trainer: boolean;
  /** Whether this activity is a commute */
  commute: boolean;
  /** Whether this activity was created manually */
  manual: boolean;
  /** Whether this activity is private */
  private: boolean;
  /** Whether this activity is flagged */
  flagged: boolean;
  /** The activity's workout type */
  workout_type: number;
  /** The unique identifier of the upload in string format */
  upload_id_str: string;
  /** The activity's average speed, in meters per second (float) */
  average_speed: number;
  /** The activity's max speed, in meters per second (float) */
  max_speed: number;
  /** Whether the logged-in athlete has kudoed this activity */
  has_kudoed: boolean;
  /** Whether the activity is muted */
  hide_from_home: boolean;
  /** The id of the gear for the activity */
  gear_id: string;
  /** The total work done in kilojoules during this activity. Rides only (float) */
  kilojoules: number;
  /** Average power output in watts during this activity. Rides only (float) */
  average_watts: number;
  /** Whether the watts are from a power meter, false if estimated */
  device_watts: boolean;
  /** Rides with power meter data only (integer) */
  max_watts: number;
  /** Similar to Normalized Power. Rides with power meter data only (integer) */
  weighted_average_watts: number;
}

// Interface representing the token data we recieve from Strava
export interface TokenData {
  /** A Strava access token used for requesting data */
  access_token: string;
  /** A Strava refresh token, used to request a new access/refresh token */
  refresh_token: string;
  /**
   * A timestamp of when the access token expires, if expired use refresh token to request new tokens
   *
   * IMPORTANT: Strava returns this in a different format (seconds rather than milliseconds) so we convert it
   * before saving it back to the database
   */
  expires_at: number;
}

export interface ProcessedActivityData
  extends TokenData,
    Pick<
      StravaActivity,
      | "name"
      | "distance"
      | "moving_time"
      | "type"
      | "average_speed"
      | "start_date"
    > {
  /** A timestamp representing when we last fetched activity data from Strava */
  updated: number;
}

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
  const pantryId = process.env.PANTRY_ID;
  const newStravaBasket = process.env.NEW_STRAVA_BASKET;
  if (!pantryId || !newStravaBasket) {
    return json(
      { error: "No pantryId or Strava basket found" },
      { status: 500 }
    );
  }
  const data = await getPantry(pantryId, newStravaBasket);
  //   if (updated > Date.now() - 1000 * 60 * 5) {
  //     return json(data);
  //   }
  if (data.expires_at < Date.now()) {
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
      return json({ error: "Environment variables missing" }, { status: 500 });
    }
    const tokens = await refreshStravaTokens(
      process.env.STRAVA_CLIENT_ID,
      process.env.STRAVA_CLIENT_SECRET,
      data.refresh_token
    );
    data.expires_at = tokens.expires_at * 1000;
    data.refresh_token = tokens.refresh_token;
    data.access_token = tokens.access_token;
  }
  const activities = await getStravaActivities(data.access_token);
  data.updated = Date.now();
  const response = await putPantry(pantryId, newStravaBasket, data);
  return response;
};

const refreshStravaTokens = async (
  stravaClientId: string,
  stravaClientSecret: string,
  refreshToken: string
): Promise<TokenData> => {
  const response = await fetch(
    `https://www.strava.com/oauth/token?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`,
    { method: "POST" }
  );
  return response.json();
};

const getStravaActivities = async (
  stravaAccessToken: string
): Promise<StravaActivity[]> => {
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?access_token=${stravaAccessToken}`
  );
  return response.json();
};

const getPantry = async (
  pantryId: string,
  basketName: string
): Promise<ProcessedActivityData> => {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${basketName}`
  );
  return response.json();
};

const putPantry = async (
  pantryId: string,
  basketName: string,
  data: ProcessedActivityData
) => {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${basketName}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.json();
};
