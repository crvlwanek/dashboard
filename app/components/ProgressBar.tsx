import { useNavigation } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"

export default function ProgressBar() {
  const navigation = useNavigation()
  const active = navigation.state !== "idle"

  const ref = useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = useState(true)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    if (active) {
      setAnimationComplete(false)
    }

    Promise.allSettled(ref.current.getAnimations().map(({ finished }) => finished)).then(
      () => !active && setAnimationComplete(true)
    )
  }, [active])

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? "Loading" : undefined}
      className="fixed inset-x-0 top-0 left-0 z-50 h-[2px]"
    >
      <div
        ref={ref}
        className={`h-full bg-primary-light transition-all duration-500 ease-in-out ${
          navigation.state === "idle" && animationComplete && "w-0 opacity-0 transition-none"
        } ${navigation.state === "submitting" && "w-4/12"} ${
          navigation.state === "loading" && "w-4/6"
        } ${navigation.state === "idle" && !animationComplete && "w-full"}`}
      />
    </div>
  )
}
