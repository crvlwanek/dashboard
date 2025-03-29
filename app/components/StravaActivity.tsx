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
import Card from "~/common/components/Card"

export interface StravaActivityProps {
  activity: ProcessedActivityData["most_recent_activity"]
  mapUrl?: string
}

export default function StravaActivity({ activity, mapUrl }: StravaActivityProps) {
  if (!activity) {
    // Fail case if we weren't able to get data from Strava
    return <div>Oops, Strava didn't load correctly</div>
  }
  const date = new DateTime(activity.start_date).format()
  const distance = `${metersToMiles(activity.distance)} mi`
  const pace = `${formatTimeDuration(
    secondsToDuration(metersPerSecondToSecondsPerMile(activity.average_speed)),
    "colon"
  )} /mi`
  const movingTime = formatTimeDuration(secondsToDuration(activity.moving_time), "letter")
  return (
    <Card className="stravaActivityMain">
      <div className="stravaActivityHeader absolute z-[2] bg-surface-alpha-600 w-full backdrop-blur-3xl drop-shadow-md">
        <div className="stravaTopHeader">
          <h5>{activity.name}</h5>
          <a
            target="_blank"
            rel="noreferrer"
            className="stravaViewLink hover:underline font-medium"
            href={Strava.activitiesUrl + activity.id.toString()}
          >
            View on Strava
          </a>
        </div>
        <div className="flex align-center">
          <Icon iconKey="shoe" size={16} className="stravaShoeIcon" />
          <h6 className="text-deemp">{date}</h6>
        </div>
      </div>
      {/** Not really sure why but there's a bit of a gap at the bottom, so add some negative margin */}
      <div className="stravaMapContainer">
        {mapUrl && (
          <img style={{ maxWidth: "100%", marginBottom: -4, position: "absolute" }} src={mapUrl} />
        )}
        <div className="skeleton stravaMapLoadingBackground" />
        <PoweredByStrava className="stravaLogo" />
      </div>
      <div className="stravaActivityFloatingDetails text-white flex gap-12 py-2 px-4 absolute bottom-0 w-full mt-10">
        <div>
          <h6 className="text-lg tracking-wide leading-8 font-black">Distance</h6>
          <h5>{distance}</h5>
        </div>
        <div>
          <h6 className="text-sm tracking-wide leading-8 ">Pace</h6>
          <h5>{pace}</h5>
        </div>
        <div>
          <h6 className="text-sm tracking-wide leading-8 ">Time</h6>
          <h5>{movingTime}</h5>
        </div>
      </div>
    </Card>
  )
}
