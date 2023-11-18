import useLocalStorage from "~/hooks/useLocalStorage";
import IconButton from "./IconButton";
import { LOCAL_STORAGE_THEME_KEY } from "~/constants";
import { useCallback, useEffect } from "react";
import Divider from "./Divider";
import Icon from "./Icon";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_THEME_KEY, "light");
  useEffect(() => {
    document?.getElementById("body")?.setAttribute("theme", theme);
  }, [theme]);
  const switchTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);
  return (
    <IconButton
      iconKey={theme === "light" ? "sun" : "moon"}
      onClick={switchTheme}
    >
      <fieldset className="themeMenu card">
        <legend style={{ display: "none" }}>Pick a theme</legend>
        <label className="themeMenuOption">
          <input type="radio" />
          System
          <Icon iconKey="moon" />
        </label>
        <Divider />
        <label className="themeMenuOption">
          <input type="radio" />
          Light
          <Icon iconKey="sun" />
        </label>
        <Divider />
        <label className="themeMenuOption">
          <input type="radio" />
          Dark
          <Icon iconKey="moon" />
        </label>
      </fieldset>
    </IconButton>
  );
}
