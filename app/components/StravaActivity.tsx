import { ProcessedActivityData } from "~/routes/api.strava";
import {
  formateTimeDuration,
  metersPerSecondToSecondsPerMile,
  metersToMiles,
} from "~/utilities/converters";
import Card from "./Card";
import PoweredByStrava from "../svg/PoweredByStrava";

export interface StravaActivityProps {
  activity: ProcessedActivityData["most_recent_activity"];
}

export default function StravaActivity({ activity }: StravaActivityProps) {
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
    <Card>
      <div className="stravaActivityHeader">
        <div>{activity.name}</div>
        <div>{date}</div>
      </div>
      <hr />
      <div className="stravaActivityDetails">
        <div>
          <label>Distance</label>
          <div>{distance}</div>
        </div>
        <div>
          <label>Pace</label>
          <div>{pace}</div>
        </div>
        <div>
          <label>Time</label>
          <div>{movingTime}</div>
        </div>
      </div>
      <PoweredByStrava className="stravaLogo" />
    </Card>
  );
}
