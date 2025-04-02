import { NotionCheckbox, NotionNumber, NotionURL } from "~/integrations/Notion"

export type ReadingListBook = {
  "Current Page": NotionNumber
  "Currently Reading": NotionCheckbox
  "Last edited time": {}
  Name: {}
  URL: NotionURL
}
