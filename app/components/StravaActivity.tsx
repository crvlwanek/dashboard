import { ProcessedActivityData } from "~/routes/api.strava"
import {
  formatTimeDuration,
  metersPerSecondToSecondsPerMile,
  metersToMiles,
  secondsToDuration,
} from "~/utilities/converters"
import PoweredByStrava from "../svg/PoweredByStrava"
import Divider from "./Divider"
import Icon from "./Icon"

export interface StravaActivityProps {
  activity: ProcessedActivityData["most_recent_activity"]
  mapUrl?: string
}

export default function StravaActivity({ activity, mapUrl }: StravaActivityProps) {
  if (!activity) {
    // Fail case if we weren't able to get data from Strava
    return <div>Oops, Strava didn't load correctly</div>
  }
  // TODO: If it was yesterday, write "Yesterday" instead
  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(activity.start_date))
  const distance = `${metersToMiles(activity.distance)} mi`
  const pace = `${formatTimeDuration(
    secondsToDuration(metersPerSecondToSecondsPerMile(activity.average_speed)),
    "colon"
  )} /mi`
  const movingTime = formatTimeDuration(secondsToDuration(activity.moving_time), "letter")
  return (
    <div className="card stravaActivity_main">
      <div className="stravaActivityHeader strava-padding">
        <h5>{activity.name}</h5>
        <div className="flex align-center">
          <Icon iconKey="shoe" size={16} className="stravaShoeIcon" />
          <h6 className="labelColor">{date}</h6>
        </div>
      </div>
      <Divider />
      {/** Not really sure why but there's a bit of a gap at the bottom, so add some negative margin */}
      {mapUrl && <img style={{ maxWidth: "100%", marginBottom: -4 }} src={mapUrl} />}
      <div className="stravaActivityDetails strava-padding stravaFloatingDetails">
        <div>
          <h6>Distance</h6>
          <h5>{distance}</h5>
        </div>
        <Divider vertical />
        <div>
          <h6>Pace</h6>
          <h5>{pace}</h5>
        </div>
        <Divider vertical />
        <div>
          <h6>Time</h6>
          <h5>{movingTime}</h5>
        </div>
      </div>
    </div>
  )
}
