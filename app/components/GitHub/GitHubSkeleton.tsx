import Divider from "../Divider"
import { GitHubSection } from "./GitHubRecentRepos"

type GitHubSkeletonProps = {
  repoLimit: number
  className?: string
}

export default function GitHubSkeleton({ repoLimit, className }: GitHubSkeletonProps) {
  return (
    <GitHubSection className={className}>
      {Array(repoLimit)
        .fill(0)
        .map((_, index) => (
          <>
            <div key={index} className="repoWrapper" style={{ width: "100%" }}>
              <div className="skeleton" style={{ width: 200, height: 15, margin: "5px 0" }} />
              <div className="skeleton" style={{ width: "100%", height: 10, margin: "5px 0" }} />
              <div
                className="skeleton"
                style={{ width: 400, height: 10, margin: "5px 0", maxWidth: "100%" }}
              />
              <div className="skeleton" style={{ width: 60, height: 10, marginTop: 8 }} />
            </div>
            {index != repoLimit - 1 && <Divider />}
          </>
        ))}
    </GitHubSection>
  )
}
