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
    // 리뷰 목록 가져오기
    instance
      .get("/review/list") // 백엔드에서 전체 리뷰 목록을 가져오는 API
      .then((res) => {
        // 서버에서 반환되는 리뷰 데이터에 좋아요 수(likeCount)를 포함해서 처리
        const reviewsWithLikes = res.data.data.map((review) => ({
          ...review,
          liked: false, // 좋아요 상태는 기본적으로 false
          likeCount: review.likeCount || 0, // 서버에서 받은 likeCount 값을 사용하여 초기값 설정
        }));
        console.log(res);

        setReviews(reviewsWithLikes); // 리뷰 목록 상태 업데이트

        // 리뷰별로 좋아요 상태 가져오기
        reviewsWithLikes.forEach((review) => {
          instance
            .get(`/review/likes/status?reviewId=${review.reviewId}`)
            .then((statusRes) => {
              console.log(review);
              // 해당 리뷰에 대한 좋아요 상태를 갱신
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
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  const handleLikeClick = (reviewId, isLiked) => {
    const apiCall = isLiked
      ? instance.delete(`/review/unlike/${reviewId}`, FormData) // 좋아요 취소
      : instance.post(`/review/like/${reviewId}`, FormData); // 좋아요 추가

    apiCall
      .then((res) => {
        if (res.data.success) {
          // 좋아요 상태가 변경되면 리뷰 업데이트
          instance
            .get(`/review/view/${reviewId}`, FormData)
            .then((updatedReviewRes) => {
              const updatedReview = updatedReviewRes.data.data;
              setReviews((prevReviews) =>
                prevReviews.map((r) =>
                  r.reviewId === reviewId
                    ? {
                        ...r,
                        liked: !isLiked, // 상태 변경
                        likeCount: updatedReview.likeCount, // 업데이트된 좋아요 수 (서버에서 받은 값으로 갱신)
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
              <strong>가게 이름:</strong> {review.storeName} <br />
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
              {/* 파일 첨부 부분 */}
              {review.files.length > 0 && (
                <div>
                  <strong>첨부된 파일:</strong>
                  <div>
                    {review.files.map((fileItem, index) => (
                      <img
                        key={index}
                        src={`${process.env.REACT_APP_HOST}/file/view/${fileItem.saveFileName}`}
                        alt={`첨부 파일 ${index + 1}`}
                        style={{
                          width: "100px",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
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
