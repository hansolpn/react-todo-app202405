import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  API_BASE_URL as BASE,
  USER,
} from '../../config/host-config';
import AuthContext from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomSnackBar from '../layout/CustomSnackBar';
import { KAKAO_AUTH_URL } from '../../config/kakao-config';
import axios from 'axios';

const Login = () => {
  const REQUEST_URL = BASE + USER + '/signin';

  const { onLogin, isLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const redirection = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setOpen(true); // 스낵바 오픈
      // 일정 시간 뒤 Todo 화면으로 redirect
      setTimeout(() => {
        redirection('/');
      }, 3500);
    }
  }, [isLoggedIn]);

  // 서버에 비동기 로그인 요청(AJAX 요청)
  // 함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴합니다.
  const fetchLogin = async () => {
    // 이메일, 비밀번호 입력 태그 취득하기
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');

    // await는 async로 선언된 함수에서만 사용이 가능합니다.
    // await는 프로미스 객체가 처리될 때까지 기다립니다.
    // 프로미스 객체의 반환값을 바로 활용할 수 있도록 도와줍니다.
    // then()을 활용하는 것보다 가독성이 좋고, 쓰기도 쉽습니다.
    /*
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    });
    */
    const res = await axios.post(REQUEST_URL, {
      email: $email.value,
      password: $password.value,
    });

    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const { token, userName, role } = await res.data;

    // Context API를 사용하여 로그인 상태를 업데이트 합니다.
    onLogin(token, userName, role);

    // 홈으로 리다이렉트
    redirection('/');
  };

  const loginHandler = (e) => {
    e.preventDefault();
    // 입력값에 관련된 처리를 하고 싶다면 여기서 하시면 됩니다.
    // 예제에서는 생략하겠습니다.

    // 서버에 로그인 요청 전송
    fetchLogin();
  };

  return (
    <>
      {!isLoggedIn && (
        <Container
          component='main'
          maxWidth='xs'
          style={{ margin: '200px auto' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component='h1' variant='h5'>
                로그인
              </Typography>
            </Grid>
          </Grid>

          <form noValidate onSubmit={loginHandler}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  id='email'
                  label='email address'
                  name='email'
                  autoComplete='email'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='password'
                  label='on your password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                >
                  로그인
                </Button>
              </Grid>
              <Grid item xs={12}>
                <a href={KAKAO_AUTH_URL}>
                  <img
                    style={{ width: '100%' }}
                    alt='kakaobtn'
                    src={require('../../assets/img/kakao_login_medium_wide.png')}
                  />
                </a>
              </Grid>
            </Grid>
          </form>
        </Container>
      )}
      <CustomSnackBar open={open} />
    </>
  );
};

export default Login;
