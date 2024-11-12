import { Link } from "react-router-dom";
const Mypage = () => {
    return (
        <div>
            <h2>마이 페이지</h2>
            <p>
                <Link to="/user/edit">회원수정 페이지</Link>
            </p>
            <p>
                <Link to="/review/myreview">나의 리뷰 페이지</Link>
            </p>
        </div>
    );
};
export default Mypage;
