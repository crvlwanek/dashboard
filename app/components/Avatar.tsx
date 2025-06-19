import { HasClassName } from "../common/interfaces"

export interface AvatarProps extends HasClassName {
  size?: number
  src: string
}

export default function Avatar({ size, src, className }: AvatarProps) {
  // Set default values
  size ??= 100
  return (
    <div className="relative rounded-full overflow-hidden place-self-start">
      <img
        className={`rounded-full select-none object-cover ${
          className ?? ""
        } h-[${size}px] w-[${size}px]`}
        height={size}
        width={size}
        src={src}
      />
      <div className="ring-overlay absolute inset-0 w-full h-full rounded-full bg-white/5 pointer-events-none z-[2]" />
    </div>
  )
}
