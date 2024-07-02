import Divider from "~/components/Divider"
import GitHubSkeleton from "~/components/GitHub/GitHubSkeleton"
import StravaSkeleton from "~/components/StravaSkeleton"

export default function About() {
  return (
    <div className="max-w-[900px] m-auto">
      <div className="flex pt-20 align-center justify-center gap-4 p-4 pb-0">
        <h1 className="text-center text-3xl">About This Website</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_350px] place-items-center items-stretch p-4">
        <div className="bg-surface p-4 rounded shadow-md flex flex-col gap-2">
          <h2 className="text-xl text-center">Skeleton Placeholders</h2>
          <Divider />
          <p>
            This website makes frequent usage of skeleton placeholders to hold the place of content
            while it loads.
          </p>
          <p>
            Since I'm fetching data from multiple different sources, it takes some time to get all
            of that data and render it out on the webpage. In the meantime, showing a loading state
            like this informs the user that the website is still working, but the data is in the
            process of loading
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <StravaSkeleton />
          <p className="text-center italic">Strava and GitHub loading skeletons</p>
        </div>
        <GitHubSkeleton repoLimit={4} className="col-span-1 md:col-span-2" />
      </div>
    </div>
  )
}
