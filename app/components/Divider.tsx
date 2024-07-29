export interface DividerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement> {
  vertical?: boolean
}

export default function Divider({ vertical, className, ...rest }: DividerProps) {
  return <hr className={`${vertical ? "vertical" : ""} ${className ? className : ""}`} {...rest} />
}
