import Divider from "../Divider"
import Icon from "../Icon"
import { GitHub } from "~/integrations/GitHub"
import GitHubChipBox from "./GitHubChipBox"
import { HasClassName, HasReactChildren } from "../../common/interfaces"
import { DateTime } from "~/utilities/DateTime"
import Card from "~/common/components/Card"

interface GitHubSectionProps extends HasReactChildren, HasClassName {}

export function GitHubSection({ children, className }: GitHubSectionProps) {
  return (
    <Card className={`githubRepos ${className ?? ""}`}>
      <div className="flex align-center githubHeaderContainer">
        <Icon iconKey="github" size={30} />
        <h3 className="githubHeader">GitHub Repos</h3>
        <Divider />
      </div>
      {children}
    </Card>
  )
}

type GitHubRecentReposProps = {
  repos: GitHub.MinimalRepository[]
  repoLimit: number
}

export default function GitHubRecentRepos({ repos, repoLimit }: GitHubRecentReposProps) {
  if (!(repos instanceof Array)) {
    console.error(repos)
    throw new Error("Did not recieve repo data as an array")
  }

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
                {new DateTime(repo.pushed_at).since()}
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
