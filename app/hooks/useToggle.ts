import { useCallback, useState } from "react"

/** Toggle value and the function to toggle the state */
type ToggleInterface = [boolean, () => void, (value: boolean) => void]

export default function useToggle(defaultValue: boolean): ToggleInterface {
  const [value, setValue] = useState(defaultValue)

  const toggleValue = useCallback(() => {
    setValue(currentValue => !currentValue)
  }, [setValue])

  return [value, toggleValue, setValue]
}
