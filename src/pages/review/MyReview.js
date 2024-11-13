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
      navigate("/user/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    }
  }, [navigate, userInfo]);

  // 내 리뷰 가져오기
  const fetchMyReviews = () => {
    instance
      .get("/review/my-reviews")
      .then((res) => {
        console.log(res.data); // 이곳에서 실제로 받아오는 데이터 확인
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

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleEditClick = (reviewId) => {
    // 리뷰 수정 페이지로 이동하며, 수정할 리뷰 ID 전달
    navigate(`/review/edit/${reviewId}`);
  };

  const handleDeleteClick = (reviewId) => {
    // 삭제 확인 알림
    Swal.fire({
      title: "리뷰 삭제",
      text: "정말로 이 리뷰를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        // 리뷰 삭제 API 호출
        instance
          .delete(`/review/delete/${reviewId}`, {
            params: { userId: userInfo.id }, // 현재 로그인된 사용자 ID 전달
          })
          .then(() => {
            Swal.fire("삭제됨!", "리뷰가 삭제되었습니다.", "success");
            // 리뷰 목록을 새로고침
            fetchMyReviews(); // 삭제 후 `fetchMyReviews` 호출
          })
          .catch((error) => {
            console.error("리뷰 삭제 실패:", error);
            Swal.fire("삭제 실패", "리뷰 삭제에 실패했습니다.", "error");
          });
      }
    });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>나의 리뷰 페이지</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <strong>작성자:</strong> {review.username} <br />
              <strong>가게 이름:</strong> {review.storeName} <br />
              <strong>별점:</strong> {review.rating} ⭐ <br />
              <strong>리뷰:</strong> {review.reviewComment} <br />
              <strong>좋아요 수:</strong> {review.likeCount} ❤️ <br />{" "}
              {/* 좋아요 수 표시 */}
              {/* 수정 버튼 */}
              <button onClick={() => handleEditClick(review.reviewId)}>
                수정
              </button>
              {/* 삭제 버튼 */}
              <button onClick={() => handleDeleteClick(review.reviewId)}>
                삭제
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
