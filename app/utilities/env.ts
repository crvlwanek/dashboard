import EnvironmentVariables from "~/common/utils/EnvironmentVariables"

const env = new EnvironmentVariables([
  "STRAVA_CLIENT_ID",
  "STRAVA_CLIENT_SECRET",
  "PANTRY_ID",
  "NEW_STRAVA_BASKET",
  "MAPBOX_TOKEN",
  "GOOGLE_MAPS_API_KEY",
])

export default env
