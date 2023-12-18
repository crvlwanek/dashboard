const image = "https://i.imgur.com/7VP7DiQ.jpg"

export default function AboutMe() {
  return (
    <>
      <div className="w-full h-screen flex items-center flex-col gap-4 bg-surface-bg px-4">
        <div className="w-full h-[200px] object-cover about-hero-image bg-cover bg-center absolute" />
        <div className="w-full max-w-3xl min-h-4 rounded-2xl overflow-hidden flex flexible gap-6 z-[2] bg-surface p-4 mt-28 shadow-xl">
          <img
            src={image}
            className="aspect-square object-cover rounded-full w-[300px] self-start"
          />
          <div>
            <div className="text-2xl pb-4">This is a short description</div>
            <div>
              This will be the <b>About Me</b> page! For now, I really don't have anything to say
              here so it will just end up being lorem ipsum. Lorem ipsum dolor sit amet, consectetur
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
