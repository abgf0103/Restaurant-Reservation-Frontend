import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Link 임포트
import instance from "../../api/instance"; // axios 인스턴스

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.user);

  useEffect(() => {
    instance
      .get("/review/list")
      .then((res) => {
        const reviewsWithLikes = res.data.data.map((review) => ({
          ...review,
          liked: false,
        }));
        setReviews(reviewsWithLikes);

        reviewsWithLikes.forEach((review) => {
          instance
            .get(`/review/likes/status?reviewId=${review.reviewId}`)
            .then((statusRes) => {
              setReviews((prevReviews) =>
                prevReviews.map((r) =>
                  r.reviewId === review.reviewId
                    ? { ...r, liked: statusRes.data }
                    : r
                )
              );
            })
            .catch((error) => {
              console.error("좋아요 상태 확인 실패:", error);
            });
        });
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

  const handleLikeClick = (reviewId, isLiked) => {
    const apiCall = isLiked
      ? instance.delete(`/review/unlike/${reviewId}`)
      : instance.post(`/review/like/${reviewId}`);

    apiCall
      .then((res) => {
        if (res.data.success) {
          instance
            .get(`/review/view/${reviewId}`)
            .then((updatedReviewRes) => {
              const updatedReview = updatedReviewRes.data.data;
              setReviews((prevReviews) =>
                prevReviews.map((r) =>
                  r.reviewId === reviewId
                    ? {
                        ...r,
                        liked: !isLiked,
                        likeCount: updatedReview.likeCount,
                      }
                    : r
                )
              );
            })
            .catch((error) => {
              console.error("리뷰 업데이트 실패:", error);
            });

          Swal.fire(
            isLiked ? "좋아요 취소" : "좋아요",
            isLiked
              ? "리뷰의 좋아요가 취소되었습니다."
              : "리뷰에 좋아요가 추가되었습니다.",
            "success"
          );
        }
      })
      .catch((error) => {
        console.error(isLiked ? "좋아요 취소 실패" : "좋아요 추가 실패", error);
        Swal.fire(
          "실패",
          isLiked
            ? "좋아요 취소에 실패했습니다."
            : "좋아요 추가에 실패했습니다.",
          "error"
        );
      });
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
              <strong>작성자:</strong>
              <Link to={`/review/${review.username}`}>{review.username}</Link>
              <br />
              <strong>가게 이름:</strong> {review.storeName}{" "}
              {/* storeName 표시 */}
              <br />
              <strong>별점:</strong> {review.rating} ⭐
              <br />
              <strong>리뷰:</strong> {review.reviewComment}
              <br />
              <strong>좋아요:</strong> {review.likeCount} ❤️
              <br />
              <button
                onClick={() => handleLikeClick(review.reviewId, review.liked)}
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
