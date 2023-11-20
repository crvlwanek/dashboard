export namespace GitHub {
  const urlBase = "https://api.github.com/"

  export type MinimalRepository = {
    id: number
    name: string
    full_name: string
    private: boolean
    html_url: string
    description: string
    updated_at: string
  }

  type ListUserReposParams = {
    type?: "all" | "owner" | "member"
    sort?: "created" | "updated" | "pushed" | "full_name"
    direction?: "asc" | "desc"
    per_page?: number
    page?: number
  }

  /**
   * GitHub API for listing all repositories for a given user
   *
   * https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
   */
  export async function listUserRepos(
    username: string,
    params: ListUserReposParams = {}
  ): Promise<MinimalRepository[]> {
    const url = new URL(`${urlBase}users/${username}/repos`)
    Object.keys(params).forEach(key => {
      const value = params[key as keyof ListUserReposParams]
      if (!value) {
        return
      }
      url.searchParams.set(key, value.toString())
    })

    const res = await fetch(url.href, {
      headers: { accept: "application/vnd.github+json" },
    })
    return res.json()
  }
}
