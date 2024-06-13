import React, { useEffect } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

const BoardDetail = () => {
  // 경로 상에 붙은 변수정보(path variable)을 가져오는 방법.
  // ex) /board/detail/{data}
  const { id } = useParams();

  // 요청과 함께 전달된 쿼리스트링을 가져오는 방법.
  // ex) /board/list?page=2&size=10
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const size = searchParams.get('size') || 10;

  const navigate = useNavigate();

  const goToList = () => {
    // navigate(`/board/list?page=${page}&size=${size}`);
    navigate('/board/list', {
      search: `page=${page}&size=${size}`,
    });
  };

  useEffect(() => {
    console.log('boardDetail의 useEffect 호출!');
    // 백엔드로 요청 보내세요. 위에서 id 얻어왔으니까.
    console.log('id: ', id);
    console.log('page: ', page);
    console.log('size: ', size);
  }, []);

  return (
    <div style={{ marginTop: '300px' }}>
      <h2>Board Detail: {id}</h2>
      {/* 글 상세 내용 렌더링 */}
      <button onClick={goToList}>목록으로 돌아가기</button>
    </div>
  );
};

export default BoardDetail;
