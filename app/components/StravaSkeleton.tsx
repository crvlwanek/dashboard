export default function StravaSkeleton() {
  return (
    <div className="card stravaActivityMain shadow-md">
      <div className="stravaActivityHeader">
        <div className="skeleton" style={{ height: 15, width: 120, margin: "5px 0" }} />
        <div className="skeleton" style={{ height: 10, width: 170, margin: "5px 0" }} />
      </div>
      <div className="stravaMapContainer">
        <div className="skeleton stravaMapLoadingBackground" />
      </div>
    </div>
  )
}
