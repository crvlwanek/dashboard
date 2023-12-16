import { useEffect, useRef } from "react"
import { HasClassName, HasReactChildren } from "./commonInterfaces"

interface NavBarProps extends HasClassName, HasReactChildren {
  float?: boolean
}

export default function NavBar({ className, children, float }: NavBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!float) {
      ref.current?.classList.remove("navbarFloating")
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!ref.current) {
          return
        }
        ref.current.classList.toggle("navbarFloating", entry.isIntersecting)
      })
    })

    const topIntersecting = document?.getElementById("topIntersecting")
    if (topIntersecting) {
      observer.observe(topIntersecting)
    }

    return () => observer.disconnect()
  }, [float])
  return (
    <>
      <div id="topIntersecting" />
      <header ref={ref} className={`navbar ${float ? "navbarFloating" : ""} ${className}`}>
        {children}
      </header>
    </>
  )
}
