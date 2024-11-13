import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트

const ReviewList = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reviews, setReviews] = useState([]); // 리뷰 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

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
        // 리뷰 목록과 좋아요 상태를 API에서 받아와서 상태 업데이트
        const reviewsWithLikes = res.data.data.map((review) => ({
          ...review,
          liked: review.likeCount > 0, // 좋아요 상태 추가 (초기값은 서버에서 받은 데이터 기반)
        }));
        setReviews(reviewsWithLikes);
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

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (reviewId, userId) => {
    // 현재 리뷰에서 좋아요 상태 확인
    const reviewIndex = reviews.findIndex(
      (review) => review.reviewId === reviewId
    );
    if (reviewIndex === -1) return;

    const review = reviews[reviewIndex];
    const isLiked = review.liked;

    if (isLiked) {
      // 좋아요 취소
      instance
        .delete(`/review/unlike/${reviewId}`)
        .then((res) => {
          if (res.data.success) {
            Swal.fire(
              "좋아요 취소",
              "리뷰의 좋아요가 취소되었습니다.",
              "success"
            );
            setReviews((prevReviews) =>
              prevReviews.map((r) =>
                r.reviewId === reviewId
                  ? { ...r, likeCount: r.likeCount - 1, liked: false }
                  : r
              )
            );
          }
        })
        .catch((error) => {
          console.error("좋아요 취소 실패:", error);
          Swal.fire("실패", "좋아요 취소에 실패했습니다.", "error");
        });
    } else {
      // 좋아요 추가
      instance
        .post(`/review/like/${reviewId}`)
        .then((res) => {
          if (res.data.success) {
            Swal.fire("좋아요", "리뷰에 좋아요가 추가되었습니다.", "success");
            setReviews((prevReviews) =>
              prevReviews.map((r) =>
                r.reviewId === reviewId
                  ? { ...r, likeCount: r.likeCount + 1, liked: true }
                  : r
              )
            );
          }
        })
        .catch((error) => {
          console.error("좋아요 추가 실패:", error);
          Swal.fire("실패", "좋아요를 추가하는 데 실패했습니다.", "error");
        });
    }
  };

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
              <strong>좋아요:</strong> {review.likeCount}❤️ <br />
              <button
                onClick={() => handleLikeClick(review.reviewId, review.userId)}
              >
                {review.liked ? "좋아요 취소" : "좋아요"}
              </button>
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
