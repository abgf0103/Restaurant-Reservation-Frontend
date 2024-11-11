import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트

const MyReview = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  // 내 리뷰 가져오기
  useEffect(() => {
    const fetchMyReviews = () => {
      instance
        .get("/review/my-reviews")
        .then((res) => {
          setReviews(res.data); // 사용자 리뷰 목록 설정
        })
        .catch((error) => {
          console.error("나의 리뷰 가져오기 실패:", error);
          Swal.fire({
            title: "실패",
            text: "나의 리뷰를 가져오는 데 실패했습니다.",
            icon: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchMyReviews();
  }, []);

  const handleEditClick = (reviewId) => {
    // 리뷰 수정 페이지로 이동하며, 수정할 리뷰 ID 전달
    navigate(`/review/edit/${reviewId}`);
  };

                // 로그인한 사용자만의 리뷰를 가져오는 API 호출
                const response = await axios.get(`${process.env.REACT_APP_HOST}/review/my-reviews`, {
                    headers: {
                        Authorization: token,
                    },
                });

  return (
    <div>
      <h2>나의 리뷰 페이지</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <strong>작성자:</strong> {review.username} <br />
              <strong>가게 ID:</strong> {review.storeId} <br />
              <strong>별점:</strong> {review.rating} ⭐ <br />
              <strong>리뷰:</strong> {review.reviewComment} <br />
              {/* 수정 버튼 추가 */}
              <button onClick={() => handleEditClick(review.reviewId)}>
                수정
              </button>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>작성된 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default MyReview;
