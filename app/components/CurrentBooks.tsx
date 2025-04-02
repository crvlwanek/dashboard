import { ErrorBoundary } from "./ErrorBoundary"
import ErrorBox from "~/common/components/ErrorBox"
import { Suspense } from "react"
import { Await } from "@remix-run/react"
import Divider from "./Divider"
import { HasClassName } from "../common/interfaces"
import Card from "~/common/components/Card"
import { VolumeResponseWithReadingDetails } from "~/implementations/Notion"

type CurrentBooksProps = {
  data: Promise<VolumeResponseWithReadingDetails[]>
}

const stripHTML = (str: string): string => {
  return str.replace(/(<([^>]+)>)/gi, "")
}

const missingImagePlaceholder = "https://books.google.com/googlebooks/images/no_cover_thumb.gif"

export default function CurrentBooks({ data }: CurrentBooksProps) {
  return (
    <ErrorBoundary fallback={<ErrorBox>Whoops! Failed to load current book data</ErrorBox>}>
      <Suspense fallback={<CurrentBooksSkeleton />}>
        <Await resolve={data}>
          {volumes => {
            if (!volumes.length) return <></>

            volumes.sort(
              (a, b) => new Date(b.lastEditedTime).valueOf() - new Date(a.lastEditedTime).valueOf()
            )

            return (
              <Card className="overflow-hidden">
                <h1 className="py-2 px-3 text-lg">Books I'm Currently Reading</h1>
                {volumes.map(volume => {
                  const { volumeInfo, currentPageNumber } = volume
                  if (!volumeInfo) {
                    return
                  }

                  const {
                    pageCount,
                    imageLinks,
                    previewLink,
                    title,
                    authors,
                    publishedDate,
                    description,
                  } = volumeInfo
                  const percentComplete = (((currentPageNumber ?? 0) / pageCount) * 100).toFixed(2)
                  return (
                    <div key={volume.id}>
                      <Divider />
                      <div className="flex">
                        <img
                          src={imageLinks?.thumbnail ?? missingImagePlaceholder}
                          className="place-self-start h-[150px] object-cover m-4 flex-shrink-0"
                        />
                        <div className="flex flex-col pr-4 py-4">
                          <div>
                            <a
                              href={previewLink}
                              className="underline inline-block"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h2 className="text-lg">{title}</h2>
                            </a>
                            <span className="text-sm whitespace-nowrap">
                              {" "}
                              by {authors.join(", ")}
                            </span>
                          </div>
                          <div className="labelColor text-xs my-1">
                            {publishedDate.split("-")[0]} • {pageCount} pages
                          </div>
                          <div className="text-fourlines text-sm">{stripHTML(description)}</div>
                          <div>
                            <div className="bg-hoverHighlightAlpha w-full rounded-full mt-4 h-2">
                              <div
                                className="bg-primary rounded-full h-full"
                                style={{ width: `${percentComplete}%` }}
                              />
                            </div>
                            <div className="w-full text-center text-sm labelColor mt-1">
                              {`${currentPageNumber ?? 0} / ${pageCount} pages`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Card>
            )
          }}
        </Await>
      </Suspense>
    </ErrorBoundary>
  )
}

export function CurrentBooksSkeleton({ className }: HasClassName) {
  return (
    <Card className={"overflow-hidden w-full max-w-full " + (className ?? "")}>
      <h1 className="py-2 px-3 text-lg">Books I'm Currently Reading</h1>
      {[0].map(val => (
        <div key={val}>
          <Divider />
          <div className="flex w-full">
            <div className="skeleton m-4 h-[150px] w-[94px] flex-shrink-0" />
            <div className="flex flex-col justify-center pr-4 gap-2">
              <div className="skeleton h-4 w-[200px]" />
              <div className="skeleton h-2 w-[50px]" />
              <div className="grid gap-1">
                <div className="skeleton h-3 w-[200px]" />
                <div className="skeleton h-3 w-[400px]" />
                <div className="skeleton h-3 w-[400px]" />
                <div className="skeleton h-3 w-[400px]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}
