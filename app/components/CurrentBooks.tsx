import { VolumeResponse } from "~/integrations/GoogleBooks"
import { ErrorBoundary } from "./ErrorBoundary"
import ErrorBox from "~/common/components/ErrorBox"
import { Suspense } from "react"
import { Await } from "@remix-run/react"
import Divider from "./Divider"

type CurrentBooksProps = {
  data: Promise<VolumeResponse[]>
}

const missingImagePlaceholder = "https://books.google.com/googlebooks/images/no_cover_thumb.gif"

export default function CurrentBooks({ data }: CurrentBooksProps) {
  return (
    <ErrorBoundary fallback={<ErrorBox>Whoops! Failed to load current book data</ErrorBox>}>
      <Suspense fallback={<div>Loading book data...</div>}>
        <Await resolve={data}>
          {volumes => (
            <div className="overflow-hidden card">
              <h1 className="p-4 text-xl">Books I'm Currently Reading</h1>

              {volumes.map(volume => {
                if (!volume.volumeInfo) {
                  return
                }
                return (
                  <>
                    <Divider key={volume.id} />
                    <div className="flex">
                      <img
                        src={volume.volumeInfo.imageLinks?.thumbnail ?? missingImagePlaceholder}
                        className="place-self-start h-[100px] w-[100px] object-cover m-4"
                      />
                      <div className="px-4 flex flex-col justify-center">
                        <a
                          href={volume.volumeInfo.previewLink}
                          className="underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <h2 className="text-lg">{volume.volumeInfo.title}</h2>
                        </a>
                        <div className="labelColor text-sm">
                          {" "}
                          by {volume.volumeInfo.authors.join(", ")}
                        </div>
                        <div className="labelColor text-xs my-1">
                          {volume.volumeInfo.publishedDate.split("-")[0]} •{" "}
                          {volume.volumeInfo.pageCount} pages
                        </div>
                      </div>
                    </div>
                  </>
                )
              })}
            </div>
          )}
        </Await>
      </Suspense>
    </ErrorBoundary>
  )
}
