import axios from 'axios';
import Cookies from 'js-cookie';

function getTokens() {
  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');
  return { accessToken, refreshToken };
}

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + '/go',
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken, refreshToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers['Refresh-Token'] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.error || '알 수 없는 에러가 발생했습니다.';
    
    if (error.response?.status === 401) {
      window.location.href = '/unauthorized';
    } else {
      alert(errorMessage);
    }
    
    return Promise.reject(error);
  }
);
export default apiClient;