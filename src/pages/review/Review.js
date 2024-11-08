import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../../hooks/tokenSlice";
import { getUserInfo } from "../../hooks/userSlice";
import axios from "axios";
import Swal from "sweetalert2";

const Review = () => {
    const navigate = useNavigate();

    // Redux에서 로그인 정보를 가져옴
    const tokenInfo = useSelector(getTokenInfo);
    const userInfo = useSelector(getUserInfo);

    // 리뷰 작성 상태
    const [review, setReview] = useState({
        storeId: "", // 예시로 storeId를 추가, 실제로 필요한 storeId를 받아와야 함
        rating: "",
        reviewComment: "",
    });

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // 로그인된 상태인지 확인
        const storedTokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (storedTokenInfo && storedUserInfo) {
            setIsAuthenticated(true);
        } else if (tokenInfo && userInfo) {
            setIsAuthenticated(true);
        } else {
            // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
            navigate("/user/login");
        }
    }, [tokenInfo, userInfo, navigate]);

    if (!isAuthenticated) {
        return <div>Loading...</div>; // 로그인 상태가 아닌 경우 로딩 화면
    }

    // 리뷰 작성 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 리뷰 저장하기 (백엔드로 POST 요청)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 로그인 상태에서 인증된 토큰을 헤더에 추가
            const token = `${tokenInfo.tokenType} ${tokenInfo.accessToken}`;

            // 리뷰를 백엔드로 전송 (엔드포인트 수정)
            const response = await axios.post(
                `${process.env.REACT_APP_HOST}/review/save`, // URL 수정
                {
                    storeId: review.storeId,
                    rating: review.rating,
                    reviewComment: review.reviewComment,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: "성공",
                    text: "리뷰가 저장되었습니다.",
                    icon: "success",
                });
                // 리뷰 저장 후 메인 페이지로 이동
                navigate("/"); // or navigate("/reviews") 등
            }
        } catch (err) {
            console.error("Review save error:", err);
            Swal.fire({
                title: "실패",
                text: "리뷰 저장에 실패했습니다.",
                icon: "error",
            });
        }
    };

    return (
        <div>
            <h1>리뷰 작성 페이지</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Store ID:</label>
                    <input
                        type="text"
                        name="storeId"
                        value={review.storeId}
                        onChange={handleChange}
                        placeholder="가게 ID를 입력하세요."
                        required
                    />
                </div>
                <div>
                    <label>Rating:</label>
                    <input
                        type="number"
                        name="rating"
                        value={review.rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        placeholder="1에서 5 사이로 평가해주세요."
                        required
                    />
                </div>
                <div>
                    <label>Review Comment:</label>
                    <textarea
                        name="reviewComment"
                        value={review.reviewComment}
                        onChange={handleChange}
                        placeholder="리뷰를 작성해주세요."
                        required
                    />
                </div>
                <button type="submit">리뷰 작성</button>
            </form>
        </div>
    );
};

export default Review;
