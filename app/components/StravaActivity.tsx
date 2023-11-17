import { ProcessedActivityData } from "~/routes/api.strava";

export interface StravaActivityProps {
  activity: ProcessedActivityData["most_recent_activity"];
}

export default function StravaActivity({ activity }: StravaActivityProps) {
  return (
    <div>
      <div>{activity.name}</div>
      <div>{activity.start_date}</div>
      <hr />
      <div>
        <div>{activity.distance}</div>
        <div>{activity.average_speed}</div>
        <div>{activity.moving_time}</div>
      </div>
    </div>
  );
}
