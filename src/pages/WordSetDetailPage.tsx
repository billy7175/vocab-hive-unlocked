import { Navigate } from 'react-router-dom';

// 단어장 상세 페이지를 난이도별 단어장으로 리다이렉트
const WordSetDetailPage = () => {
  return <Navigate to="/level-based" replace />;
};

export default WordSetDetailPage;