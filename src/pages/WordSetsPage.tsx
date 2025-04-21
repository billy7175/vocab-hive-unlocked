import { Navigate } from "react-router-dom";

// WordSets 페이지를 난이도별 단어장 페이지로 리다이렉트
const WordSetsPage = () => {
  return <Navigate to="/level-based" replace />;
};

export default WordSetsPage;