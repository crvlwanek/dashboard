/** Dependencies:
 *   React, Tailwind
 *
 * CSS classes: bg-surface
 */

type CardProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

/** CSS classes: bg-surface */
export default function Card({ children, className, ...rest }: CardProps) {
  const defaultClasses = "bg-surface rounded shadow-md"
  const classes = className ? `${defaultClasses} ${className}` : defaultClasses

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
