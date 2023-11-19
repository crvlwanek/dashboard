import useLocalStorage from "~/hooks/useLocalStorage";
import IconButton from "./IconButton";
import { LOCAL_STORAGE_THEME_KEY } from "~/constants";
import { useEffect } from "react";
import Divider from "./Divider";
import Icon from "./Icon";
import useToggle from "~/hooks/useToggle";

export type ThemeSetting = "system" | "light" | "dark";

const getIconKey = (theme: ThemeSetting) => {
  if (theme === "system") {
    return "theme";
  }
  if (theme === "light") {
    return "sun";
  }
  return "moon";
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<ThemeSetting>(
    LOCAL_STORAGE_THEME_KEY,
    "system"
  );
  useEffect(() => {
    document?.getElementById("body")?.setAttribute("theme", theme);
  }, [theme]);

  const [menuShown, toggleMenuShown] = useToggle(false);
  return (
    <div className="themeWrapper">
      <IconButton iconKey={getIconKey(theme)} onClick={toggleMenuShown} />
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
  );
}
