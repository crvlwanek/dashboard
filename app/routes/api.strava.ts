import { LoaderFunction, json } from "@remix-run/node";

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
  //   if (updated < Date.now() - 1000 * 60 * 2) {
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

  //  4. Retrive new data from Strava endpoint
  const activities = await getStravaActivities(access_token);
  //  5. Process that data
  //  6. Save the result back to the database
  newPantryData.updated = Date.now();
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
