import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트

const ReviewList = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      navigate("/user/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    }
  }, [navigate, userInfo]);

  // 리뷰 목록 가져오기
  useEffect(() => {
    instance
      .get("/review/list")
      .then((res) => {
        setReviews(res.data.data);
      })
      .catch((error) => {
        console.error("리뷰 목록 가져오기 실패:", error);
        Swal.fire({
          title: "실패",
          text: "리뷰 목록을 가져오는 데 실패했습니다.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
              <strong>작성자:</strong> {review.username} <br />
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
