import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';

function normalizeWeather(item) {
  const id = item.id;

  // 1) id 기반 분류가 가장 정확
  if (typeof id === 'number') {
    if (id === 800) return 1;
    if ((id >= 801 && id <= 804) || (id >= 701 && id <= 781)) return 4;
    if (
      (id >= 200 && id <= 232) ||
      (id >= 300 && id <= 321) ||
      (id >= 500 && id <= 531) ||
      id === 511
    )
      return 3;
    if (id >= 600 && id <= 622) return 2;
  }
}

export default function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lat = 33.30988532211815;
      const lon = 126.6372046778684;
      const res = await axios.get('/api/weather', { params: { lat, lon } });
      const apiContent = res.data?.weather?.[0] || null;

      if (!mountedRef.current) return;
      setWeather(normalizeWeather(apiContent));
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  });

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { weather, loading, error, refetch };
}
