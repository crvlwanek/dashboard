import useAsync from "./useAsync";

const defaultOptions = {
  headers: { "Content-Type": "application/json" },
};

export default function useFetch(
  url: string,
  options = {},
  dependencies: any[] = []
) {
  return useAsync(() => {
    return fetch(url, { ...defaultOptions, ...options }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return res.json().then((json) => Promise.reject(json));
    });
  }, dependencies);
}
