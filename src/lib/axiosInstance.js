import axios from 'axios';

const DEV_ACCESS = process.env.NEXT_PUBLIC_API_ACCESS_TOKEN || '';
const DEV_REFRESH = process.env.NEXT_PUBLIC_API_REFRESH_TOKEN || '';

let isRefreshing = false;
let queue = [];

// 새 액세스 토큰 발급
async function refreshAccessToken() {
  const res = await axios.post(
    `'/api/auth/reissue`,
    { refreshToken: DEV_REFRESH },
    { withCredentials: false }
  );
  const content = res.data?.content || {};
  const newAccess = content.accessToken;
  if (!newAccess) throw new Error('No access token in refresh response');
  return newAccess;
}

const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: false,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const token =
    (typeof window !== 'undefined' &&
      (localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token'))) ||
    DEV_ACCESS;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config || {};
    if (err?.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    isRefreshing = true;
    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      localStorage.setItem('access_token', newToken);
      queue.forEach((p) => p.resolve(newToken));
      queue = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (e) {
      queue.forEach((p) => p.reject(e));
      queue = [];
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
