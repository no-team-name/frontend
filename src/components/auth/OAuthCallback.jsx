// OAuthCallback.jsx (react-router-dom v6 버전)
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL의 쿼리 파라미터에서 토큰 값 가져오기
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // 예시: 쿠키 만료시간 1일로 설정 (필요에 따라 조정)
      const expires = new Date();
      expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
      const expiresStr = `; expires=${expires.toUTCString()}`;

      // 쿠키에 저장 (Secure 옵션이나 SameSite 설정은 HTTPS 환경에서만 가능)
      document.cookie = `accessToken=${accessToken}${expiresStr}; path=/;`;
      document.cookie = `refreshToken=${refreshToken}${expiresStr}; path=/;`;
    }

    // 쿼리 파라미터 제거 및 홈("/")으로 리다이렉트
    navigate('/');
  }, [navigate]);

  return (
    <div>
      <p>로그인 처리 중입니다. 잠시만 기다려 주세요...</p>
    </div>
  );
};

export default OAuthCallback;
