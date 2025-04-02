// Docs on Notion types:
// https://developers.notion.com/reference/property-object

type NotionPropertyType =
  | "checkbox"
  | "created_by"
  | "created_time"
  | "date"
  | "email"
  | "files"
  | "formula"
  | "last_edited_by"
  | "last_edited_time"
  | "multi_select"
  | "number"
  | "people"
  | "phone_number"
  | "relation"
  | "rich_text"
  | "rollup"
  | "select"
  | "status"
  | "title"
  | "url"

export type NotionURL = {
  id: string
  type: "url"
  url: string
}

export type NotionCheckbox = {
  id: string
  type: "checkbox"
  checkbox: boolean
}

export type NotionNumber = {
  id: string
  type: "number"
  number: number | null
}

export type NotionLastEditedTime = {
  id: string
  type: "last_edited_time"
  last_edited_time: string
}

// https://developers.notion.com/reference/post-database-query-filter
type NotionFilter = {
  property: string
  checkbox?: NotionFilterCheckboxConditions
}

type NotionFilterCheckboxConditions = {
  equals?: boolean
  does_not_equal?: boolean
}

type NotionQueryDatabaseResponse<TProperties> = {
  object: string
  results: NotionQueryDatabaseResult<TProperties>[]
  next_cursor: string
  has_more: boolean
  type: string
  page_or_database: object
}

type NotionQueryDatabaseResult<TProperties> = {
  object: string
  id: string
  created_time: string
  last_edited_time: string
  created_by: NotionObject
  last_edited_by: NotionObject
  cover: {
    type: string
    external: {
      url: string
    }
  }
  icon: {
    type: string
    emoji: string
  }
  parent: {
    type: string
    database_id: string
  }
  archived: boolean
  properties: TProperties
  url: string
}

type NotionObject = {
  object: string
  id: string
}

type NotionDatabaseQuery = {
  database_id: string
  filter?: NotionFilter
}

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

    // TODO: Add type info instead of typing as any
    return response.json()
  }

  public static getParagraphs(response: any): string[] {
    return response?.results?.map((result: any) => {
      const richText = result?.paragraph?.rich_text
      if (!richText?.length) {
        return ""
      }
      return richText[0].plain_text
    })
  }

  // https://developers.notion.com/reference/retrieve-a-database
  public async retrieveDatabase(databaseId: string) {
    const url = new URL(`${this._baseURL}/databases/${databaseId}`)

    const response = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    })

    if (response.status >= 400) {
      console.error(response)
      return undefined
    }

    return response.json()
  }

  // https://developers.notion.com/reference/retrieve-a-database
  public async queryDatabase<TProperties>({
    database_id,
    filter,
  }: NotionDatabaseQuery): Promise<NotionQueryDatabaseResponse<TProperties> | undefined> {
    const url = new URL(`${this._baseURL}/databases/${database_id}/query`)

    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter }),
    })

    // In case I actually need the real error codes later...
    // https://developers.notion.com/reference/status-codes#error-codes
    if (response.status >= 400) {
      console.error(response)
      return undefined
    }

    return response.json() as Promise<NotionQueryDatabaseResponse<TProperties>>
  }
}
