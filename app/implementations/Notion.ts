import GoogleBooks, { VolumeResponse } from "~/integrations/GoogleBooks"
import Notion, {
  NotionCheckbox,
  NotionLastEditedTime,
  NotionNumber,
  NotionURL,
} from "~/integrations/Notion"
import env from "~/utilities/env"

export type ReadingListBook = {
  "Current Page": NotionNumber
  "Currently Reading": NotionCheckbox
  "Last edited time": NotionLastEditedTime
  Name: {}
  URL: NotionURL
}

export interface VolumeResponseWithReadingDetails extends VolumeResponse {
  currentPageNumber: number | null
  lastEditedTime: string
}

const getCurrentBooks = async (): Promise<VolumeResponseWithReadingDetails[]> => {
  const BOOK_DATABASE_ID = "1c66162faf418054969fd5c966ef80b5"
  const notion = new Notion(env.get("NOTION_API_KEY"))
  const notionCurrentBooks = await notion.queryDatabase<ReadingListBook>({
    database_id: BOOK_DATABASE_ID,
    filter: {
      property: "Currently Reading",
      checkbox: {
        equals: true,
      },
    },
  })

  // Error is already logged in the query function
  if (!notionCurrentBooks) return []

  const { results } = notionCurrentBooks
  const currentBooks = results
    .map(result => {
      return {
        volumeId: result.properties.URL.url.split("/").slice(-1)[0],
        currentPageNumber: result.properties["Current Page"].number,
        lastEditedTime: result.properties["Last edited time"].last_edited_time,
      }
    })
    .filter(x => x)
  const volumeData = await Promise.all(
    currentBooks.map(books => GoogleBooks.getVolume(books.volumeId))
  )

  return volumeData.map(volume => {
    const book = currentBooks.find(book => book.volumeId === volume.id)!
    return {
      ...volume,
      ...book,
    }
  })
}

export { getCurrentBooks }
