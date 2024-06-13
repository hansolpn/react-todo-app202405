import './App.css';
import TodoTemplate from './components/todo/TodoTemplate';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import {
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import Login from './components/user/Login';
import Join from './components/user/Join';
import { AuthContextProvider } from './utils/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import KakaoLoginHandler from './components/user/KakaoLoginHandler';
import root from './router/root';

function App() {
  return (
    // 데이터를 전달하고자 하는 자식 컴포넌트를 Provider로 감쌉니다.
    <AuthContextProvider>
      <RouterProvider router={root} />
    </AuthContextProvider>
  );
}

export default App;
