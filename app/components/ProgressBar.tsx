import { useNavigation } from "@remix-run/react"

export default function ProgressBar() {
  const navigation = useNavigation()
  if (navigation.state === "idle") {
    return null
  }
  return (
    <div
      role="progressbar"
      className={`loadingIndicator fixed inset-0 h-[2px] w-2/4 bg-primary-light z-50`}
    />
  )
}
