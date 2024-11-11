import { Link } from "react-router-dom";
const MyReview = () => {
    return (
        <div>
            <h2>나의 리뷰 페이지</h2>
            <p>
                <Link to="/review/edit">리뷰수정 페이지</Link>
            </p>
        </div>
    );
};
export default MyReview;
