import useLocalStorage from "~/hooks/useLocalStorage"
import IconButton from "./IconButton"
import { LOCAL_STORAGE_THEME_KEY } from "~/constants"
import { useCallback, useEffect, useState } from "react"
import Divider from "./Divider"
import Icon from "./Icon"
import useToggle from "~/hooks/useToggle"
import { windowIsUndefined } from "~/utilities/helperMethods"

export type ThemeSetting = "system" | "light" | "dark"
type ThemeSwitcherIcon = "theme" | "sun" | "moon"

export const useTheme = (): "light" | "dark" => {
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>("system")
  const [themePreference, setThemePreference] = useState<"light" | "dark">("light")

  useEffect(() => {
    if (windowIsUndefined()) {
      return
    }
    const body = document?.getElementById("body")
    setThemeSetting((body?.getAttribute("theme") as ThemeSetting) ?? "system")
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName !== "theme") {
          return
        }
        const theme = (mutation.target as HTMLElement).getAttribute("theme") as ThemeSetting
        setThemeSetting(theme)
      })
    })
    if (body) {
      observer.observe(body, { attributes: true })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)")
    const onPreferenceChange = (event: MediaQueryList | MediaQueryListEvent) => {
      setThemePreference(event.matches ? "dark" : "light")
    }
    onPreferenceChange(darkModePreference)
    darkModePreference.addEventListener("change", onPreferenceChange)
    return () => darkModePreference.removeEventListener("change", onPreferenceChange)
  }, [])

  return themeSetting === "system" ? themePreference : themeSetting
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<ThemeSetting>(LOCAL_STORAGE_THEME_KEY, "system")
  const [icon, setIcon] = useState<ThemeSwitcherIcon>("theme")
  const [menuShown, toggleMenuShown] = useToggle(false)

  useEffect(() => {
    document?.getElementById("body")?.setAttribute("theme", theme)
    setIcon(theme === "system" ? "theme" : theme === "light" ? "sun" : "moon")
  }, [theme])

  const selectTheme = useCallback((theme: ThemeSetting) => {
    setTheme(theme)
    toggleMenuShown()
  }, [])

  return (
    <div className="themeWrapper" onClick={e => e.stopPropagation()}>
      <IconButton iconKey={icon} onClick={toggleMenuShown} />
      {menuShown && (
        <>
          <fieldset className="themeMenu card shadow-md" id="themeMenu">
            <legend style={{ display: "none" }}>Pick a theme</legend>
            <label className="themeMenuOption">
              <input
                name="theme"
                onClick={() => selectTheme("system")}
                type="radio"
                className="themeInput"
                checked={theme === "system"}
              />
              System
              <Icon iconKey="theme" />
            </label>
            <Divider />
            <label className="themeMenuOption">
              <input
                name="theme"
                onClick={() => selectTheme("light")}
                type="radio"
                className="themeInput"
                checked={theme === "light"}
              />
              Light
              <Icon iconKey="sun" />
            </label>
            <Divider />
            <label className="themeMenuOption">
              <input
                name="theme"
                onClick={() => selectTheme("dark")}
                type="radio"
                className="themeInput"
                checked={theme === "dark"}
              />
              Dark
              <Icon iconKey="moon" />
            </label>
          </fieldset>
          <div onClick={toggleMenuShown} className="themeMenuVeil"></div>
        </>
      )}
    </div>
  )
}
