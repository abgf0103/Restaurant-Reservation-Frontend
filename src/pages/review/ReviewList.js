import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import instance from "../../api/instance"; // axios 인스턴스

const ReviewList = () => {
  const [reviews, setReviews] = useState([]); // 리뷰 상태 (리뷰 목록을 저장)
  const [loading, setLoading] = useState(true); // 로딩 상태 (리뷰 목록이 로드될 때까지 로딩을 표시)
  const userInfo = useSelector((state) => state.user); // Redux에서 사용자 정보 가져오기 (로그인 상태 확인 등)

  useEffect(() => {
    // 리뷰 목록 가져오기 (페이지가 처음 로드될 때 한 번 실행됨)
    instance
      .get("/review/list")
      .then((res) => {
        // 리뷰 목록을 가져오고, 각 리뷰에 좋아요 상태(liked)를 추가하여 상태 업데이트
        const reviewsWithLikes = res.data.data.map((review) => ({
          ...review,
          liked: false, // 초기 liked 값은 false
        }));
        setReviews(reviewsWithLikes);

        // 각 리뷰에 대해 현재 로그인된 사용자의 좋아요 상태를 가져오기
        reviewsWithLikes.forEach((review) => {
          instance
            .get(`/review/likes/status?reviewId=${review.reviewId}`)
            .then((statusRes) => {
              // 서버에서 받은 좋아요 상태를 이용해 리뷰 목록의 상태를 업데이트
              setReviews((prevReviews) =>
                prevReviews.map((r) =>
                  r.reviewId === review.reviewId
                    ? { ...r, liked: statusRes.data } // 좋아요 상태(liked) 업데이트
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
        // 리뷰 데이터를 성공적으로 가져왔거나 실패한 후에 로딩 상태를 false로 설정
        setLoading(false);
      });
  }, []); // 빈 배열을 의존성 배열로 넣어, 처음 렌더링 시에만 실행됨

  // 좋아요 클릭 처리 함수
  const handleLikeClick = (reviewId, isLiked) => {
    // 좋아요 상태에 따라 적절한 API 호출
    const apiCall = isLiked
      ? instance.delete(`/review/unlike/${reviewId}`) // 좋아요 취소
      : instance.post(`/review/like/${reviewId}`); // 좋아요 추가

    apiCall
      .then((res) => {
        if (res.data.success) {
          // 좋아요 처리 후 성공 시, 서버에서 해당 리뷰의 최신 likeCount를 가져오기
          instance
            .get(`/review/view/${reviewId}`) // 리뷰의 최신 정보를 가져오는 API 호출 (최신 likeCount 포함)
            .then((updatedReviewRes) => {
              const updatedReview = updatedReviewRes.data.data;

              // 리뷰 목록에서 해당 리뷰를 찾아서 좋아요 상태(liked)와 likeCount를 최신 값으로 갱신
              setReviews((prevReviews) =>
                prevReviews.map((r) =>
                  r.reviewId === reviewId
                    ? {
                        ...r,
                        liked: !isLiked, // 좋아요 상태 반전
                        likeCount: updatedReview.likeCount, // 서버에서 받은 최신 likeCount로 업데이트
                      }
                    : r
                )
              );
            })
            .catch((error) => {
              console.error("리뷰 업데이트 실패:", error);
            });

          // 성공 메시지 표시
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
        // API 호출 실패 시 오류 처리
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
    // 로딩 중일 때는 "로딩 중..." 메시지를 표시
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
              <strong>좋아요:</strong> {review.likeCount} ❤️ <br />
              <button
                onClick={() => handleLikeClick(review.reviewId, review.liked)}
              >
                {review.liked ? "좋아요 취소" : "좋아요"}{" "}
                {/* 버튼 텍스트를 liked 상태에 맞게 변경 */}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // 리뷰가 없다면 '작성된 리뷰가 없습니다.' 메시지 표시
        <p>작성된 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default ReviewList;
