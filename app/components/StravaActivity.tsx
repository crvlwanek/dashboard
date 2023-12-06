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
import Strava from "~/integrations/Strava"
import { DateTime } from "~/utilities/DateTime"

export interface StravaActivityProps {
  activity: ProcessedActivityData["most_recent_activity"]
  mapUrl?: string
}

const formatDateTime = (dateString: string) => {
  const date = DateTime.setMidnight(new Date(dateString))
  const today = DateTime.today()
  const yesterday = DateTime.yesterday()

  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const relativeDay = isToday ? rtf.format(0, "day") : isYesterday ? rtf.format(-1, "day") : ""

  return (
    (relativeDay ? relativeDay.charAt(0).toUpperCase() + relativeDay.slice(1) + " at " : "") +
    new Intl.DateTimeFormat("en-US", {
      dateStyle: isToday || isYesterday ? undefined : "long",
      timeStyle: "short",
    }).format(new Date(dateString))
  )
}

export default function StravaActivity({ activity, mapUrl }: StravaActivityProps) {
  if (!activity) {
    // Fail case if we weren't able to get data from Strava
    return <div>Oops, Strava didn't load correctly</div>
  }
  // TODO: If it was yesterday, write "Yesterday" instead
  const date = formatDateTime(activity.start_date)
  const distance = `${metersToMiles(activity.distance)} mi`
  const pace = `${formatTimeDuration(
    secondsToDuration(metersPerSecondToSecondsPerMile(activity.average_speed)),
    "colon"
  )} /mi`
  const movingTime = formatTimeDuration(secondsToDuration(activity.moving_time), "letter")
  return (
    <div className="card stravaActivityMain">
      <div className="stravaActivityHeader">
        <div className="stravaTopHeader">
          <h5>{activity.name}</h5>
          <a
            target="_blank"
            rel="noreferrer"
            className="stravaViewLink"
            href={Strava.activitiesUrl + activity.id.toString()}
          >
            View on Strava
          </a>
        </div>
        <div className="flex align-center">
          <Icon iconKey="shoe" size={16} className="stravaShoeIcon" />
          <h6 className="labelColor">{date}</h6>
        </div>
      </div>
      <Divider />
      {/** Not really sure why but there's a bit of a gap at the bottom, so add some negative margin */}
      <div className="stravaMapContainer">
        {mapUrl && <img style={{ maxWidth: "100%", marginBottom: -4 }} src={mapUrl} />}
        <PoweredByStrava className="stravaLogo" />
      </div>
      <div className="stravaActivityDetails stravaFloatingDetails">
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
