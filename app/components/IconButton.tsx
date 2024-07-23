import { HTMLAttributes } from "react"
import Icon, { HasIcon } from "./Icon"
import { HasClassName, HasReactChildren } from "../common/interfaces"

export interface IconButtonProps extends HasIcon, HasReactChildren, HasClassName {
  size?: number
  openInNewTab?: boolean
  href?: string
  onClick?: () => void
  onBlur?: () => void
}

export default function IconButton({
  iconKey,
  size,
  href,
  openInNewTab,
  onClick,
  children,
  className,
  onBlur,
}: IconButtonProps) {
  const Wrapper = ({ children, className }: { children: any; className?: string }) => {
    if (!href) {
      return <button {...{ className, onClick, onBlur }}>{children}</button>
    }
    const args = openInNewTab ? { target: "_blank", rel: "noreferrer" } : {}
    return <a {...{ className, href, onBlur, ...args }}>{children}</a>
  }

  return (
    <Wrapper className={`iconButton ${className ?? ""}`}>
      <Icon {...{ iconKey, size }} />
      {children}
    </Wrapper>
  )
}
