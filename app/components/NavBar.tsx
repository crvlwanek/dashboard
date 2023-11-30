import { useEffect, useRef } from "react"
import { HasClassName, HasReactChildren } from "./commonInterfaces"

interface NavBarProps extends HasClassName, HasReactChildren {}

export default function NavBar({ className, children }: NavBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
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
  }, [])
  return (
    <>
      <div id="topIntersecting" />
      <header ref={ref} className={`navbar navbarFloating ${className}`}>
        {children}
      </header>
    </>
  )
}
