import { VolumeResponse } from "~/integrations/GoogleBooks"
import { ErrorBoundary } from "./ErrorBoundary"
import ErrorBox from "~/common/components/ErrorBox"
import { Suspense } from "react"
import { Await } from "@remix-run/react"
import Divider from "./Divider"

type CurrentBooksProps = {
  data: Promise<VolumeResponse[]>
}

export default function CurrentBooks({ data }: CurrentBooksProps) {
  return (
    <ErrorBoundary fallback={<ErrorBox>Whoops! Failed to load current book data</ErrorBox>}>
      <Suspense fallback={<div>Loading book data...</div>}>
        <Await resolve={data}>
          {volumes => (
            <div className="overflow-hidden card">
              <h1 className="p-4">Books I'm Currently Reading</h1>
              <Divider />
              {volumes.map(volume => (
                <div key={volume.id} className="flex ">
                  <img src={volume.volumeInfo.imageLinks.thumbnail} className="place-self-start" />
                  <div className="p-4">
                    <h1>
                      {volume.volumeInfo.title}
                      <span className="label"> by {volume.volumeInfo.authors.join(", ")}</span>
                    </h1>
                    <p>{volume.volumeInfo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </ErrorBoundary>
  )
}
