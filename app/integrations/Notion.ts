export default class Notion {
  private _apiKey: string

  private readonly _baseURL = "https://api.notion.com/v1"

  public constructor(apiKey: string) {
    this._apiKey = apiKey
  }

  /** https://developers.notion.com/reference/get-block-children */
  public async retrieveBlockChildren(
    blockId: string,
    options?: { start_cursor?: string; page_size?: number }
  ) {
    const url = new URL(`${this._baseURL}/blocks/${blockId}/children`)
    if (options?.page_size) {
      url.searchParams.set("page_size", options.page_size.toString())
    }

    if (options?.start_cursor) {
      url.searchParams.set("start_cursor", options.start_cursor)
    }

    const response = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    })

    // TODO: would be cool to implement 429 handling (retry after)
    // https://developers.notion.com/reference/request-limits

    return response.json()
  }
}
