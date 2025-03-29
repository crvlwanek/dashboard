import { useEffect, useRef, useState } from "react"
import IconButton from "../IconButton"

type GitHubChipBoxProps = {
  topics: string[]
}

export default function GitHubChipBox({ topics }: GitHubChipBoxProps) {
  const scrollIncrement = 200

  const chipBox = useRef<HTMLDivElement>(null)
  const [translate, setTranslate] = useState(0)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  useEffect(() => {
    if (!chipBox.current) {
      return
    }

    const resizeObserver = new ResizeObserver(entries => {
      const container = entries[0]?.target
      if (!container) {
        return
      }
      setShowLeft(translate > 0)
      setShowRight(translate + container.clientWidth < container.scrollWidth)
    })

    resizeObserver.observe(chipBox.current)

    return () => resizeObserver.disconnect()
  }, [topics, translate])

  if (!topics.length) {
    return null
  }

  return (
    <div className="githubChipBox relative overflow-x-hidden mt-1">
      {showLeft && (
        <div className="githubChipsLeftWrapper absolute w-fit pr-[30px] top-0 z-[2]">
          <IconButton
            onClick={() => {
              setTranslate(prev => Math.max(0, prev - scrollIncrement))
            }}
            className="githubChipsLeft"
            iconKey="chevronLeft"
          />
        </div>
      )}
      <div
        ref={chipBox}
        style={{ transform: `translateX(-${translate}px)` }}
        className="githubChipBoxInner"
      >
        {topics.map(topic => (
          <a
            key={topic}
            className="githubChip"
            target="_blank"
            rel="noreferrer"
            href={`https://github.com/crvlwanek?tab=repositories&q=${topic}`}
          >
            {topic}
          </a>
        ))}
      </div>
      {showRight && (
        <div className="githubChipsRightWrapper absolute w-fit pl-[30px] r-0 t-0">
          <IconButton
            onClick={() => {
              setTranslate(prev => {
                if (!chipBox.current) {
                  return prev
                }
                return Math.min(
                  prev + scrollIncrement,
                  chipBox.current.scrollWidth - chipBox.current.clientWidth
                )
              })
            }}
            className="githubChipsRight"
            iconKey="chevronRight"
          />
        </div>
      )}
    </div>
  )
}
