import Divider from "../Divider"
import Icon from "../Icon"
import { GitHub } from "~/integrations/GitHub"
import { getRelativeTime } from "~/utilities/converters"
import GitHubChipBox from "./GitHubChipBox"
import { HasReactChildren } from "../commonInterfaces"

export function GitHubSection({ children }: HasReactChildren) {
  return (
    <div className="card githubRepos">
      <div className="flex align-center githubHeaderContainer">
        <Icon iconKey="github" size={30} />
        <h3 className="githubHeader">GitHub Repos</h3>
        <Divider />
      </div>
      {children}
    </div>
  )
}

type GitHubRecentReposProps = {
  repos: GitHub.MinimalRepository[]
  repoLimit: number
}

export default function GitHubRecentRepos({ repos, repoLimit }: GitHubRecentReposProps) {
  return (
    <GitHubSection>
      {repos.slice(0, repoLimit).map((repo, index) => (
        <div key={repo.id}>
          <div className="repoWrapper">
            <div className="repoHeaderContainer">
              <a className="repoLink" href={repo.html_url}>
                {repo.name}
              </a>
              <div className="githubLabelText githubUpdatedAt">
                {"· updated "}
                {getRelativeTime(repo.pushed_at)}
              </div>
            </div>

            <div className="repoDescription">{repo.description}</div>
            <GitHubChipBox topics={repo.topics} />
            <div className="githubLabelText githubLanguageWrapper">
              <span
                style={{
                  backgroundColor: GitHub.languages[repo.language as GitHub.Language]?.color ?? "",
                }}
                className="githubLanguageBubble"
              ></span>
              {repo.language}
            </div>
          </div>
          {index != repoLimit - 1 && <Divider />}
        </div>
      ))}
    </GitHubSection>
  )
}
