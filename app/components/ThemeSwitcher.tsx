import useLocalStorage from "~/hooks/useLocalStorage";
import IconButton from "./IconButton";
import { LOCAL_STORAGE_THEME_KEY } from "~/constants";
import { useCallback, useEffect } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_THEME_KEY, "light");
  useEffect(() => {
    document?.getElementById("body")?.setAttribute("theme", theme);
  }, [theme]);
  const switchTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);
  const iconKey = theme === "light" ? "sun" : "moon";
  return <IconButton iconKey={iconKey} onClick={switchTheme} />;
}
