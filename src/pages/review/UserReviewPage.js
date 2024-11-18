import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트

const UserReviewPage = () => {
  const { username } = useParams(); // URL에서 username을 받음
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 특정 사용자의 리뷰 목록을 가져오는 API 요청
    instance
      .get(`/review/view-by-username/${username}`) // 새로운 API 호출
      .then((res) => {
        setReviews(res.data.data); // 'data' 필드 안에 리뷰 목록이 있으므로
      })
      .catch((error) => {
        console.error("사용자 리뷰 가져오기 실패:", error);
        Swal.fire({
          title: "실패",
          text: "사용자의 리뷰를 가져오는 데 실패했습니다.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]); // username이 바뀔 때마다 다시 API 호출

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>{username} 사용자님의 리뷰 페이지</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <strong>작성자:</strong> {review.username} <br />
              <strong>가게 이름:</strong> {review.storeName} <br />{" "}
              {/* 가게 이름으로 수정 */}
              <strong>별점:</strong> {review.rating} ⭐ <br />
              <strong>리뷰:</strong> {review.reviewComment} <br />
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>이 사용자는 작성한 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default UserReviewPage;