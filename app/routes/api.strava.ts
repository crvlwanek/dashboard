import { LoaderFunction, json } from "@remix-run/node";

/**
 * Strava interface for activity data
 * For more info see https://developers.strava.com/playground/#/Activities/getLoggedInAthleteActivities
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

export const loader: LoaderFunction = async () => {
  // Steps for loading data from Strava:
  const pantryId = process.env.PANTRY_ID;
  const newStravaBasket = process.env.NEW_STRAVA_BASKET;
  if (!pantryId || !newStravaBasket) {
    return json(
      { error: "No pantryId or Strava basket found" },
      { status: 500 }
    );
  }
  //  1. Load existing data from the database
  const pantryData = await getPantry(pantryId, newStravaBasket);
  const { access_token, refresh_token, expires_at, updated } = pantryData;
  //  2. If that data is recent (within last 2 minutes) just return the data
  //   if (updated > Date.now() - 1000 * 60 * 2) {
  //     return json(pantryData);
  //   }
  const newPantryData = { access_token, refresh_token, expires_at, updated };
  //  3. Check the expiration on access token. If expired, request a new one using refresh token
  if (expires_at < Date.now()) {
    // await refreshStravaTokens
    // update data in pantry
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
      return json({ error: "Environment variables missing" }, { status: 500 });
    }
    const tokenResponse = await refreshStravaTokens(
      process.env.STRAVA_CLIENT_ID,
      process.env.STRAVA_CLIENT_SECRET,
      refresh_token
    );
    newPantryData.expires_at = tokenResponse.expires_at * 1000;
    newPantryData.refresh_token = tokenResponse.refresh_token;
    newPantryData.access_token = tokenResponse.access_token;
  }
  newPantryData.updated = Date.now();

  //  4. Retrive new data from Strava endpoint
  const activities = await getStravaActivities(access_token);
  //  5. Process that data
  //  6. Save the result back to the database

  const response = await putPantry(pantryId, newStravaBasket, newPantryData);
  //  7. Return the newly processed data
  return response;
};

const refreshStravaTokens = async (
  stravaClientId: string,
  stravaClientSecret: string,
  refreshToken: string
) => {
  const response = await fetch(
    `https://www.strava.com/oauth/token?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`,
    { method: "POST" }
  );
  return response.json();
};

const getStravaActivities = async (stravaAccessToken: string) => {
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?access_token=${stravaAccessToken}`
  );
  return response.json();
};

const getPantry = async (pantryId: string, basketName: string) => {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${basketName}`
  );
  return response.json();
};

const putPantry = async (pantryId: string, basketName: string, data: any) => {
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
