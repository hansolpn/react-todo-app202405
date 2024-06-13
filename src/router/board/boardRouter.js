import BoardDetail from '../../components/board/BoardDetail';
import BoardList from '../../components/board/BoardList';

const boardRoutes = [
  {
    path: 'list',
    element: <BoardList />,
  },
  {
    path: 'detail/:id',
    element: <BoardDetail />,
  },
  //   {
  //     path: 'write',
  //     element: <BoardWrite />,
  //   },
];

export default boardRoutes;
