const image = "https://i.imgur.com/7VP7DiQ.jpg"

export default function AboutMe() {
  return (
    <>
      <div className="py-24 w-full flex items-center justify-center flex-col px-4 gap-4">
        <h1 className=" text-3xl">About Me</h1>
        <div className="bg-surface w-full max-w-3xl min-h-4 rounded-xl overflow-hidden shadow-xl flex flexible">
          <img src={image} className="aspect-square object-none " />
          <div className="p-4">
            <div>
              This will be the About Me page! For now, I really don't have anything to say here so
              it will just end up being lorem ipsum. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
