import useLocalStorage from "~/hooks/useLocalStorage"
import IconButton from "./IconButton"
import { LOCAL_STORAGE_THEME_KEY } from "~/constants"
import { useEffect, useState } from "react"
import Divider from "./Divider"
import Icon from "./Icon"
import useToggle from "~/hooks/useToggle"

export type ThemeSetting = "system" | "light" | "dark"
type ThemeSwitcherIcon = "theme" | "sun" | "moon"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<ThemeSetting>(LOCAL_STORAGE_THEME_KEY, "system")
  const [icon, setIcon] = useState<ThemeSwitcherIcon>("theme")

  useEffect(() => {
    document?.getElementById("body")?.setAttribute("theme", theme)
    setIcon(theme === "system" ? "theme" : theme === "light" ? "sun" : "moon")
  }, [theme])

  const [menuShown, toggleMenuShown] = useToggle(false)
  return (
    <div className="themeWrapper">
      <IconButton iconKey={icon} onClick={toggleMenuShown} />
      {menuShown && (
        <>
          <fieldset className="themeMenu card" id="themeMenu">
            <legend style={{ display: "none" }}>Pick a theme</legend>
            <label className="themeMenuOption">
              <input
                name="theme"
                onClick={() => setTheme("system")}
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
                onClick={() => setTheme("light")}
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
                onClick={() => setTheme("dark")}
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
