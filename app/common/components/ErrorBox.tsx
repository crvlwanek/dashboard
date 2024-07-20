/* Dependencies: React, Tailwind */

type ErrorBoxProps = {
  children?: React.ReactNode
}

export default function ErrorBox({ children }: ErrorBoxProps) {
  return <div className="bg-surface rounded-md p-4 w-full flex justify-center">{children}</div>
}
