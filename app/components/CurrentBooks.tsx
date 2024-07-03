import { VolumeResponse } from "~/integrations/GoogleBooks"
import { ErrorBoundary } from "./ErrorBoundary"
import ErrorBox from "~/common/components/ErrorBox"
import { Suspense } from "react"
import { Await } from "@remix-run/react"
import Divider from "./Divider"
import { HasClassName } from "./commonInterfaces"

type CurrentBooksProps = {
  data: Promise<VolumeResponse[]>
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
          {volumes => (
            <div className="overflow-hidden card shadow-md">
              <h1 className="p-4 text-xl">Books I'm Currently Reading</h1>

              {volumes.map(volume => {
                if (!volume.volumeInfo) {
                  return
                }
                return (
                  <div key={volume.id}>
                    <Divider />
                    <div className="flex">
                      <img
                        src={volume.volumeInfo.imageLinks?.thumbnail ?? missingImagePlaceholder}
                        className="place-self-start h-[150px] object-cover m-4 flex-shrink-0"
                      />
                      <div className="flex flex-col pr-4 py-4">
                        <div>
                          <a
                            href={volume.volumeInfo.previewLink}
                            className="underline inline-block"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <h2 className="text-lg">{volume.volumeInfo.title}</h2>
                          </a>
                          <span className="text-sm">
                            {" "}
                            by {volume.volumeInfo.authors.join(", ")}
                          </span>
                        </div>
                        <div className="labelColor text-xs my-1">
                          {volume.volumeInfo.publishedDate.split("-")[0]} •{" "}
                          {volume.volumeInfo.pageCount} pages
                        </div>
                        <div className="text-fourlines text-sm">
                          {stripHTML(volume.volumeInfo.description)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Await>
      </Suspense>
    </ErrorBoundary>
  )
}

export function CurrentBooksSkeleton({ className }: HasClassName) {
  return (
    <div className={"overflow-hidden card shadow-md w-full max-w-full " + (className ?? "")}>
      <h1 className="p-4 text-xl">Books I'm Currently Reading</h1>
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
    </div>
  )
}
