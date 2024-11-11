import { Link } from "react-router-dom";

const StoreInfo = () => {
    return (
        <div>
            <h2>가게 정보</h2>
            <Link to="/review">리뷰작성 페이지</Link>
            <p>
                <Link to="/map">지도 화면</Link>
            </p>
        </div>
    );
};
export default StoreInfo;
