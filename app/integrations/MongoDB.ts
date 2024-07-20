import { MongoClient, ObjectId } from "mongodb"
import env from "~/utilities/env"
import { CachedStravaData } from "~/routes/api.strava"

const uri = env.get("ATLAS_DB_URI")
const client = new MongoClient(uri)

const STRAVA_DB_NAME = "strava"
const STRAVA_ACTIVITY_COLLECTION = "mostRecentActivity"

const isTokenData = (data: any): data is CachedStravaData => {
  return (
    !!data &&
    typeof data.access_token === "string" &&
    typeof data.refresh_token === "string" &&
    typeof data.expires_at === "number" &&
    typeof data.updated === "number" &&
    !!data.most_recent_activity
  )
}

const fetchRecentActivity = async () => {
  try {
    await client.connect()
    const docs = await client
      .db(STRAVA_DB_NAME)
      .collection(STRAVA_ACTIVITY_COLLECTION)
      .find()
      .toArray()
    if (!docs.length) {
      throw new Error("Could not retrieve activity data")
    }
    const data = docs[0]
    if (!isTokenData(data)) {
      throw new Error("Token data not found")
    }
    return data
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.close()
  }
}

const setRecentActivity = async (id: ObjectId, data: CachedStravaData) => {
  try {
    await client.connect()

    const db = client.db(STRAVA_DB_NAME)
    const collection = db.collection(STRAVA_ACTIVITY_COLLECTION)

    const filter = { _id: id }
    const update = {
      $set: data,
    }

    const result = await collection.updateOne(filter, update)
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.close()
  }
}

export { fetchRecentActivity, setRecentActivity }
