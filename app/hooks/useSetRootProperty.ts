import { useEffect } from "react"
import { windowIsUndefined } from "~/utilities/helperMethods"

export default function useSetRootProperty(property: string, value: string) {
  useEffect(() => {
    if (windowIsUndefined()) {
      return
    }
    ;(document.querySelector(":root") as any).style?.setProperty(property, value)
  }, [property, value])
}
