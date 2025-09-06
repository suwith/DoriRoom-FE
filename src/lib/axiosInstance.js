import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useServerStatusStore } from '@/stores/useSeverStatusStore';

const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: false,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

// 리프레시 락/큐
let isRefreshing = false;
let refreshQueue = [];

async function refreshTokenRequest(refreshToken) {
  const re = await axios.post(
    '/api/auth/reissue',
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
      _skipAuthRefresh: true,
    }
  );
  return re.data?.content;
}

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config || {};
    if (original._skipAuthRefresh) return Promise.reject(err);

    // 서버 점검(500) 감지
    if (err?.response?.status === 500) {
      useServerStatusStore.getState().setServerDown(true);
      return Promise.reject(err);
    }

    // 토큰 만료(401) 감지
    if (err?.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }
    const { refreshToken, kind, setTokens, clearTokens } =
      useAuthStore.getState();
    if (!refreshToken) return Promise.reject(err);

    original._retry = true;

    // 이미 리프레시 중 → 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((newAccess) => {
          original.headers = {
            ...original.headers,
            Authorization: `Bearer ${newAccess}`,
          };
          return axiosInstance(original);
        })
        .catch((e) => Promise.reject(e));
    }

    // 리프레시 시작
    isRefreshing = true;
    try {
      const data = await refreshTokenRequest(refreshToken);
      const newAccess = data?.accessToken;
      const newRefresh = data?.refreshToken;

      if (!newAccess) {
        clearTokens();
        refreshQueue.forEach(({ reject }) =>
          reject(new Error('No access token in refresh response'))
        );
        refreshQueue = [];
        return Promise.reject(new Error('No access token in refresh response'));
      }

      setTokens(newAccess, newRefresh, kind);

      // 대기중 요청 처리
      refreshQueue.forEach(({ resolve }) => resolve(newAccess));
      refreshQueue = [];

      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newAccess}`,
      };
      return axiosInstance(original);
    } catch (e) {
      clearTokens();
      refreshQueue.forEach(({ reject }) => reject(e));
      refreshQueue = [];
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
