import { useEffect, useState } from "react"
import Divider from "./Divider"
import Icon from "./Icon"
import { GitHub } from "~/integrations/GitHub"
import { getRelativeTime } from "~/utilities/converters"
import GithubChipBox from "./GithubChipBox"

export default function GitHubRecentRepos() {
  const [data, setData] = useState<GitHub.MinimalRepository[] | null>(null)

  useEffect(() => {
    const getRepoList = async () => {
      const repoList = await GitHub.listUserRepos("crvlwanek", {
        sort: "pushed",
      })
      setData(repoList)
    }
    getRepoList()
  }, [])

  const repoLimit = 7

  if (data === null) {
    return <div>loading...</div>
  }

  return (
    <div className="card githubRepos">
      <div className="flex align-center githubHeaderContainer">
        <Icon iconKey="github" size={30} />
        <h3 className="githubHeader">GitHub Repos</h3>
        <Divider />
      </div>
      {data.slice(0, repoLimit).map((repo, index) => (
        <>
          <div key={repo.id} className="repoWrapper">
            <div className="repoHeaderContainer">
              <a className="repoLink" href={repo.html_url}>
                {repo.name}
              </a>
              <span className="githubLabelText">
                {" · updated "}
                {getRelativeTime(repo.updated_at)}
              </span>
              <span className="githubLabelText">
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
