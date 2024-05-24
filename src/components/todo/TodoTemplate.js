import React, { useState, useEffect } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import '../../scss/TodoTemplate.scss';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import {
  API_BASE_URL as BASE,
  TODO,
  USER,
} from '../../config/host-config';
import axiosInstance from '../../config/axios-config';

const TodoTemplate = () => {
  const redirection = useNavigate();

  // 백엔드 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함.
  const API_BASE_URL = BASE + TODO;
  const API_USER_URL = BASE + USER;

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);

  // 로딩 상태값 관리 (처음에는 로딩이 무조건 필요하기 때문에 true -> 로딩 끝나면 false로 전환)
  const [loading, setLoading] = useState(true);

  // 할 일 추가 함수
  const addTodo = async (todoText) => {
    const newTodo = {
      title: todoText,
    };

    try {
      const res = await axiosInstance.post(
        API_BASE_URL,
        newTodo,
      );
      if (res.status === 200) setTodos(res.data.todos);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => setTodos(data.todos))
      .catch((err) => {
        console.log('err: ', err);
        alert('잘못된 삭제 요청입니다!');
      });
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {
    fetch(API_BASE_URL, {
      method: 'PATCH',
      body: JSON.stringify({
        id,
        done: !done,
      }),
    })
      .then((res) => res.json())
      .then((json) => setTodos(json.todos));
  };

  // 체크가 안 된 할 일의 개수를 카운트 하기
  const countRestTodo = () =>
    todos.filter((todo) => !todo.done).length;

  // 비동기 방식 등급 승격 함수
  const fetchPromote = async () => {
    const res = await fetch(API_USER_URL + '/promote', {
      method: 'PUT',
    });

    if (res.status === 400) {
      alert('이미 프리미엄 회원입니다.');
    } else if (res.status === 200) {
      const json = await res.json();
      localStorage.setItem('ACCESS_TOKEN', json.token);
      localStorage.setItem('USER_ROLE', json.role);
    }
  };

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    const fetchTodos = async () => {
      try {
        const res = await axiosInstance.get(API_BASE_URL);
        if (res.status === 200) setTodos(res.data.todos);
      } catch (error) {
        console.log('error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // 로딩이 끝난 후 보여줄 컴포넌트
  const loadEndedPage = (
    <div className='TodoTemplate'>
      <TodoHeader
        count={countRestTodo}
        promote={fetchPromote}
      />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );

  // 로딩 중일 때 보여줄 컴포넌트
  const loadingPage = (
    <div className='loading'>
      <Spinner color='danger'>loading...</Spinner>
    </div>
  );

  return <>{loading ? loadingPage : loadEndedPage}</>;
};

export default TodoTemplate;
