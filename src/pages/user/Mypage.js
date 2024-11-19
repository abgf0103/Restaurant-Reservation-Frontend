import { Link } from "react-router-dom";
const Mypage = () => {
  return (
    <div>
      <h2>마이 페이지</h2>
      <p>
        <Link to="/user/CheckUserEdit">회원수정 페이지</Link>
      </p>
      <p>
        <Link to="/review/myreview">나의 리뷰 페이지</Link>
      </p>
      <p>
        <Link to="/user/myreserve">나의 예약 페이지</Link>
      </p>
      <p>
        <Link to="/user/deleteUser">회원 삭제</Link>
      </p>
    </div>
  );
};
export default Mypage;
