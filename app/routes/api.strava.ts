import { LoaderFunction, json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  // Steps for loading data from Strava:
  //  1. Load existing data from the database
  //  2. If that data is recent (within last 2 minutes) just return the data
  //  3. Check the expiration on access token. If expired, request a new one using refresh token
  //  4. Retrive new data from Strava endpoint
  //  5. Process that data
  //  6. Save the result back to the database
  //  7. Return the newly processed data

  return json({ hello: "world" });
};
