import React, { useContext, useEffect } from 'react';
import {
  API_BASE_URL,
  USER,
} from '../../config/host-config';
import AuthContext from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const KakaoLoginHandler = () => {
  console.log(
    '사용자가 동의화면을 통해 필수 정보 동의 후 Kakao 인증 서버에서 redirect를 진행함!',
  );

  const { onLogin } = useContext(AuthContext);
  const redirection = useNavigate();

  const REQUEST_URL = API_BASE_URL + USER;

  // URL에 쿼리스트링으로 전달된 인가 코드를 얻어오는 방법.
  const code = new URL(
    window.location.href,
  ).searchParams.get('code');

  useEffect(() => {
    // 컴포넌트가 렌더링 될 때, 인가 코드를 백엔드로 전송하는 fetch 요청
    const kakaoLogin = async () => {
      const res = await fetch(
        REQUEST_URL + '/kakaologin?code=' + code,
      );

      const { token, userName, email, role } =
        await res.json(); // 서버에서 온 json 읽기

      // Context API를 사용하여 로그인 상태를 업데이트 합니다.
      onLogin(token, userName, role);

      redirection('/');
    };

    kakaoLogin();
  }, []);

  return <div>KakaoLoginHandler</div>;
};

export default KakaoLoginHandler;
