import { useCallback, useState } from "react";
import { windowIsUndefined } from "~/utilities/helperMethods";

export type LocalStorageInterface<T> = [T, (value: T) => void, () => void];

/**
 * A custom hook to get/set/remove an item from localStorage
 * The stored value is preferred over defaultValue
 * @param key The key to retrieve from localStorage
 * @param defaultValue A default value to set in case there is no value currently stored for this key
 * @returns An array of [value, setItem, removeItem]
 */
export default function useLocalStorage<T extends string = string>(
  key: string,
  defaultValue: T
): LocalStorageInterface<T> {
  const [value, setValue] = useState(() => {
    if (windowIsUndefined()) {
      return defaultValue;
    }
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      return storedValue;
    }
    window.localStorage.setItem(key, defaultValue);
    return defaultValue;
  });

  const setItem = useCallback((value: string) => {
    setValue(value);
    window.localStorage.setItem(key, value);
  }, []);

  const removeItem = useCallback(() => {
    setValue("");
    window.localStorage.removeItem(key);
  }, []);

  return [value as T, setItem, removeItem];
}
