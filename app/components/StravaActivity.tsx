import { ProcessedActivityData } from "~/routes/api.strava";
import {
  formateTimeDuration,
  metersPerSecondToSecondsPerMile,
  metersToMiles,
} from "~/utilities/converters";
import PoweredByStrava from "../svg/PoweredByStrava";
import Divider from "./Divider";

export interface StravaActivityProps {
  activity: ProcessedActivityData["most_recent_activity"];
}

export default function StravaActivity({ activity }: StravaActivityProps) {
  if (!activity) {
    // Fail case if we weren't able to get data from Strava
    return;
  }
  // TODO: If it was yesterday, write "Yesterday" instead
  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(activity.start_date));
  const distance = `${metersToMiles(activity.distance)} mi`;
  const pace = `${formateTimeDuration(
    metersPerSecondToSecondsPerMile(activity.average_speed)
  )} /mi`;
  const movingTime = formateTimeDuration(activity.moving_time);
  return (
    <div className="card stravaActivity_main">
      <div className="stravaActivityHeader strava-padding">
        <h5>{activity.name}</h5>
        <h6 className="labelColor">{date}</h6>
      </div>
      <Divider />
      <div className="stravaActivityDetails strava-padding">
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
      <PoweredByStrava className="stravaLogo" />
    </div>
  );
}