import { useCallback, useEffect, useRef } from "react"
import { HasClassName, HasReactChildren } from "../common/interfaces"

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

  const scrollToTop = useCallback(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <>
      <div id="topIntersecting" />
      <header
        ref={ref}
        onClick={scrollToTop}
        className={`navbar ${float ? "navbarFloating" : ""} ${className}`}
      >
        {children}
      </header>
    </>
  )
}
