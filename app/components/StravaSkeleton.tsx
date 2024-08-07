import Card from "~/common/components/Card"

export default function StravaSkeleton() {
  return (
    <Card className="stravaActivityMain">
      <div className="stravaActivityHeader">
        <div className="skeleton" style={{ height: 15, width: 120, margin: "5px 0" }} />
        <div className="skeleton" style={{ height: 10, width: 170, margin: "5px 0" }} />
      </div>
      <div className="stravaMapContainer">
        <div className="skeleton stravaMapLoadingBackground" />
      </div>
    </Card>
  )
}
