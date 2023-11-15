import { useState } from "react";

/**
 * A custom hook to get/set/remove an item from localStorage
 * The stored value is preferred over defaultValue
 * @param key The key to retrieve from localStorage
 * @param defaultValue A default value to set in case there is no value currently stored for this key
 * @returns An array of [value, setItem, removeItem]
 */
export default function useLocalStorage(key: string, defaultValue: string) {
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState(storedValue ?? defaultValue);

  const setItem = (value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const removeItem = () => {
    localStorage.removeItem(key);
    setValue("");
  };

  return [value, setItem, removeItem];
}
