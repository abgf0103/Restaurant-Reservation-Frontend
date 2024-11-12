import { Link } from "react-router-dom";

const StoreSearch = () => {
    return (
        <div>
            <h2>가게 검색 페이지</h2>
            <p>
                <Link to="/user/searchresult">검색결과 페이지</Link>
            </p>
        </div>
    );
};
export default StoreSearch;
