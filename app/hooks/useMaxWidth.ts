import { useEffect, useState } from "react"

export default function useMaxWidth(width: number) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof document === "undefined") {
      return
    }
    const body = document?.querySelector("body")
    if (!body) {
      return
    }
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (!entry.borderBoxSize?.length) {
          return
        }
        const borderBoxSize = entry.borderBoxSize[0]
        setMatches(borderBoxSize.inlineSize < width)
      })
    })

    setMatches(body.clientWidth < width)
    observer.observe(body)

    return () => {
      observer.disconnect()
    }
  }, [])

  return matches
}
