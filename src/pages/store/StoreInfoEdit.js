import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";

const StoreInfoEdit = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            navigate("/user/login");
        }
    }, [navigate, userInfo]);

    // 내 가게 가져오기
    useEffect(() => {
        instance
            .get("store/mystore")
            .then((res) => {
                console.log(res);
                console.log(res.data);
                setStores(res.data); // 사용자 가게 목록 설정
            })
            .catch((error) => {
                console.error("나의 가게 가져오기 실패:", error);
                Swal.fire({
                    title: "실패",
                    text: "나의 가게 가져오는 데 실패했습니다.",
                    icon: "error",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleEditClick = (reviewId) => {
        // 가게 수정 페이지로 이동하며, 수정할 가게 ID 전달
        navigate(`/review/edit/${reviewId}`);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }
    return (
        <div>
            <h2>나의 가게 정보 페이지</h2>
            {stores.length > 0 ? (
                <ul>
                    {stores.map((review) => (
                        <li key={review.reviewId}>
                            <strong>작성자:</strong> {review.username} <br />
                            <strong>가게 ID:</strong> {review.storeId} <br />
                            <strong>별점:</strong> {review.rating} ⭐ <br />
                            <strong>리뷰:</strong> {review.reviewComment} <br />
                            {/* 수정 버튼 */}
                            <button onClick={() => handleEditClick(review.reviewId)}>수정</button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>가게가 없습니다.</p>
            )}
        </div>
    );
};
export default StoreInfoEdit;
