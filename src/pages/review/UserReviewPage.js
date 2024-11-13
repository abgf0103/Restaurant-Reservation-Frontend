import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import instance from "../../api/instance"; // axios 인스턴스

const UserReviewPage = () => {
  const { username } = useParams(); // URL에서 username을 받음
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance
      .get(`/review/list?username=${username}`) // 해당 사용자 ID에 대한 리뷰 목록을 API에서 받아옴
      .then((res) => {
        setUserReviews(res.data.data);
      })
      .catch((error) => {
        console.error("사용자 리뷰 가져오기 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>{username} 사용자님의 리뷰 페이지</h2>{" "}
      {/* URL에서 받은 username을 제목에 사용 */}
      {userReviews.length > 0 ? (
        <ul>
          {userReviews.map((review) => (
            <li key={review.reviewId}>
              <strong>작성자:</strong> {review.username} <br />
              <strong>가게 ID:</strong> {review.storeId} <br />
              <strong>별점:</strong> {review.rating} ⭐ <br />
              <strong>리뷰:</strong> {review.reviewComment} <br />
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
