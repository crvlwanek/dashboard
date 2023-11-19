import { HasClassName } from "./commonInterfaces"

export interface AvatarProps extends HasClassName {
  size?: number
  src: string
}

export default function Avatar({ size, src, className }: AvatarProps) {
  // Set default values
  size ??= 100

  return (
    <img className={`avatarImage ${size > 100 ? "large" : ""} ${className}`} height={size} width={size} src={src} />
  )
}
