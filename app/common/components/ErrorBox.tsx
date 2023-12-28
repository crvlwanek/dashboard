/* Dependencies: React, Tailwind */

interface ErrorBoxProps {
  children: React.ReactNode
}

export default function ErrorBox({ children }: ErrorBoxProps) {
  return (
    <div className="bg-red-200 text-red-700 rounded-md p-2 border-red-500 border-[1px] w-full flex justify-center">
      {children}
    </div>
  )
}
