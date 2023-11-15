import { useCallback, useEffect, useState } from "react";

export default function useAsync<T>(
  callback: () => Promise<T>,
  dependencies: any[] = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState<T>();

  const memoizedCallback = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);
    callback()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);

  return { loading, error, data };
}
