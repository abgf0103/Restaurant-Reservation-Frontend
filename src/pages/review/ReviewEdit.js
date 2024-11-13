import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../../hooks/tokenSlice";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance";

const ReviewEdit = () => {
  const { reviewId } = useParams(); // URL에서 reviewId를 가져옴
  const navigate = useNavigate();
  const tokenInfo = useSelector(getTokenInfo);
  const userInfo = useSelector(getUserInfo);

  const [review, setReview] = useState({
    storeId: "",
    rating: "",
    reviewComment: "",
  });

  const [loading, setLoading] = useState(true);

  // 로그인 상태 체크
  useEffect(() => {
    if (!tokenInfo.accessToken || !userInfo.username) {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      navigate("/user/login");
    }
  }, [navigate, tokenInfo, userInfo]);

  // 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReview = async () => {
      instance
        .get(`/review/view/${reviewId}`)
        .then((res) => {
          const { data } = res.data;
          console.log(data);
          setReview({ ...data });
        })
        .catch((error) => {
          console.error("리뷰 데이터 가져오기 실패:", error);
          Swal.fire({
            title: "실패",
            text: "리뷰 데이터를 가져오는 데 실패했습니다.",
            icon: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchReview();
  }, [reviewId, tokenInfo]);

  // 리뷰 수정 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    instance
      .put(`/review/update/${reviewId}`, {
        storeId: review.storeId,
        rating: review.rating,
        reviewComment: review.reviewComment,
        userId: userInfo.userId,
        username: userInfo.username, // username 추가
      })
      .then((res) => {
        Swal.fire({
          title: "성공",
          text: "리뷰가 수정되었습니다.",
          icon: "success",
        });
        navigate("/review/myreview"); // 수정 후, 내가 작성한 리뷰 페이지로 이동
      })
      .catch((error) => {
        console.error("리뷰 수정 오류:", error);
        Swal.fire({
          title: "실패",
          text: "리뷰 수정에 실패했습니다.",
          icon: "error",
        });
      });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{userInfo.username} 고객님 리뷰 수정</h1>
      <form onSubmit={handleSubmit}>
        {/* Store ID 필드는 아예 표시하지 않음 */}
        {/* <div>
          <label>Store ID:</label>
          <input
            type="text"
            name="storeId"
            value={review.storeId} // 기존에 작성한 내용이 value로 채워짐
            onChange={(e) => setReview({ ...review, storeId: e.target.value })}
            placeholder="가게 ID를 입력하세요."
            required
          />
        </div> */}

        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={review.rating} // 기존에 작성한 내용이 value로 채워짐
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
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
            value={review.reviewComment} // 기존에 작성한 내용이 value로 채워짐
            onChange={(e) =>
              setReview({ ...review, reviewComment: e.target.value })
            }
            placeholder="리뷰를 작성해주세요."
            required
          />
        </div>
        <button type="submit">리뷰 수정</button>
      </form>
    </div>
  );
};

export default ReviewEdit;
