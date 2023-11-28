import Divider from "./Divider"
import Icon from "./Icon"
import { GitHub } from "~/integrations/GitHub"
import { getRelativeTime } from "~/utilities/converters"
import GithubChipBox from "./GithubChipBox"

type GitHubRecentReposProps = {
  repos: GitHub.MinimalRepository[]
  repoLimit: number
}

export default function GitHubRecentRepos({ repos, repoLimit }: GitHubRecentReposProps) {
  return (
    <div className="card githubRepos">
      <div className="flex align-center githubHeaderContainer">
        <Icon iconKey="github" size={30} />
        <h3 className="githubHeader">GitHub Repos</h3>
        <Divider />
      </div>
      {repos.slice(0, repoLimit).map((repo, index) => (
        <>
          <div key={repo.id} className="repoWrapper">
            <div className="repoHeaderContainer">
              <a className="repoLink" href={repo.html_url}>
                {repo.name}
              </a>
              <div className="githubLabelText githubUpdatedAt">
                {"· updated "}
                {getRelativeTime(repo.updated_at)}
              </div>
              <span className="githubLabelText githubLanguageInfo">
                <span
                  style={{
                    backgroundColor:
                      GitHub.languages[repo.language as GitHub.Language]?.color ?? "",
                  }}
                  className="githubLanguageBubble"
                ></span>
                {repo.language}
              </span>
            </div>

            <div className="repoDescription">{repo.description}</div>
            <GithubChipBox topics={repo.topics} />
          </div>
          {index != repoLimit - 1 && <Divider />}
        </>
      ))}
    </div>
  )
}
