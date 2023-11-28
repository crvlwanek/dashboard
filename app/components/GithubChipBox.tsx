import { useCallback, useRef, useState } from "react"
import IconButton from "./IconButton"

type GithubChipBoxProps = {
  topics: string[]
}

const getMaxTranslate = (ref: React.RefObject<HTMLDivElement>): number => {
  return ref.current?.scrollWidth ?? 0 - (ref.current?.clientWidth ?? 0)
}

export default function GithubChipBox({ topics }: GithubChipBoxProps) {
  const chipBox = useRef<HTMLDivElement>(null)

  const [translate, setTranslate] = useState(0)
  const scrollIncrement = 50
  const showLeft = translate !== 0
  const showRight = translate < getMaxTranslate(chipBox)
  console.log(getMaxTranslate(chipBox))
  const scrollLeft = useCallback(() => {}, [])

  const scrollRight = useCallback(() => {
    const maxTranslate = getMaxTranslate(chipBox)
    if (translate + scrollIncrement >= maxTranslate) {
      setTranslate(maxTranslate)
      return
    }
    setTranslate(prev => prev + scrollIncrement)
  }, [])

  if (!topics.length) {
    return null
  }

  return (
    <div className="githubChipBox" style={{ transform: `translate(${translate}px)` }}>
      {showLeft && (
        <div className="githubChipsLeftWrapper">
          <IconButton className="githubChipsLeft" iconKey="chevronLeft" />
        </div>
      )}
      <div ref={chipBox} className="githubChipBoxInner">
        {topics.map(topic => (
          <a
            key={topic}
            className="githubChip"
            href={`https://github.com/crvlwanek?tab=repositories&q=${topic}`}
          >
            {topic}
          </a>
        ))}
      </div>
      {showRight && (
        <div className="githubChipsRightWrapper">
          <IconButton onClick={scrollRight} className="githubChipsRight" iconKey="chevronRight" />
        </div>
      )}
    </div>
  )
}
