import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../../hooks/tokenSlice";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";

const ReviewList = () => {
    const navigate = useNavigate();
    const tokenInfo = useSelector(getTokenInfo);
    const userInfo = useSelector(getUserInfo);

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // 로그인 상태 체크
    useEffect(() => {
        if (!tokenInfo.accessToken || !userInfo.username) {
            navigate("/user/login");
        }
    }, [navigate, tokenInfo, userInfo]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = `${tokenInfo.tokenType} ${tokenInfo.accessToken}`;

                const response = await axios.get(`${process.env.REACT_APP_HOST}/review/list`, {
                    headers: {
                        Authorization: token,
                    },
                });

                if (response.status === 200) {
                    setReviews(response.data.data);
                }
            } catch (error) {
                console.error("리뷰 목록 가져오기 실패:", error);
                Swal.fire({
                    title: "실패",
                    text: "리뷰 목록을 가져오는 데 실패했습니다.",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [tokenInfo]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <h1>리뷰 목록</h1>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.reviewId}>
                            <strong>작성자:</strong> {review.username} <br /> {/* username 추가 */}
                            <strong>가게 ID:</strong> {review.storeId} <br />
                            <strong>별점:</strong> {review.rating} ⭐ <br />
                            <strong>리뷰:</strong> {review.reviewComment} <br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>작성된 리뷰가 없습니다.</p>
            )}
        </div>
    );
};

export default ReviewList;
