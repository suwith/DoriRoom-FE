import axios from 'axios';

function readTokens() {
  if (typeof window === 'undefined')
    return { access: '', refresh: '', kind: null };
  const la = localStorage.getItem('access_token');
  const lr = localStorage.getItem('refresh_token');
  if (lr) return { access: la || '', refresh: lr, kind: 'local' };
  const sa = sessionStorage.getItem('access_token');
  const sr = sessionStorage.getItem('refresh_token');
  if (sr) return { access: sa || '', refresh: sr, kind: 'session' };
  return { access: '', refresh: '', kind: null };
}

function saveAccess(token, kind) {
  if (typeof window === 'undefined') return;
  if (kind === 'local') localStorage.setItem('access_token', token);
  if (kind === 'session') sessionStorage.setItem('access_token', token);
}

const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: false,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

// 요청 인터셉터: 세션에 토큰이 있을 때만 Authorization 부착
axiosInstance.interceptors.request.use((config) => {
  const { access } = readTokens();
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// 응답 인터셉터: 401이면 리프레시 시도 후 원요청 재시도
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config || {};
    if (original._skipAuthRefresh) return Promise.reject(err);
    if (err?.response?.status !== 401 || original._retry)
      return Promise.reject(err);

    const { refresh, kind } = readTokens();
    if (!refresh) return Promise.reject(err);

    original._retry = true;
    try {
      const re = await axios.post(
        '/api/auth/reissue',
        { refreshToken: refresh },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false,
          _skipAuthRefresh: true,
        }
      );

      const newAccess = re.data?.content?.accessToken;

      if (!newAccess) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
        }
        return Promise.reject(new Error('No access token in refresh response'));
      }

      saveAccess(newAccess, kind);
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return axiosInstance(original);
    } catch (e) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
      }
      return Promise.reject(e);
    }
  }
);

export default axiosInstance;
