interface VeilProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
}

export default function Veil({ open, className, ...rest }: VeilProps) {
  className ??= ""
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 duration-1000 transition-all
         z-10 ${open ? "" : "hidden"} ${className}`}
      {...rest}
    />
  )
}
