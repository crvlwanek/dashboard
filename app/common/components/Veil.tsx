interface VeilProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
}

export default function Veil({ open, className, ...rest }: VeilProps) {
  className ??= ""
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition duration-300 backdrop-blur-lg
         z-10 ${open ? "" : "hidden"} ${className}`}
      {...rest}
    />
  )
}
