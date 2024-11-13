import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트

const Review = () => {
  const navigate = useNavigate();
  const { storeId } = useParams(); // URL에서 storeId를 추출
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [review, setReview] = useState({
    storeId: storeId, // storeId는 URL 파라미터에서 자동으로 받아옴
    rating: "",
    reviewComment: "",
  });

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  // 리뷰 작성 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 리뷰 저장하기 (백엔드로 POST 요청)
  const handleSubmit = (e) => {
    e.preventDefault();

    instance
      .post("/review/save", {
        storeId: review.storeId,
        rating: review.rating,
        reviewComment: review.reviewComment,
        userId: userInfo.userId,
        username: userInfo.username, // username 추가
      })
      .then((res) => {
        Swal.fire({
          title: "성공",
          text: "리뷰가 저장되었습니다.",
          icon: "success",
        });
        navigate("/review/myreview"); // 내가 작성한 리뷰 페이지로 이동
      })
      .catch((error) => {
        console.error("리뷰 저장 오류:", error);
        Swal.fire({
          title: "실패",
          text: "리뷰 저장에 실패했습니다.",
          icon: "error",
        });
      });
  };

  return (
    <div>
      <h1>{userInfo.username} 고객님 리뷰 작성</h1>
      <form onSubmit={handleSubmit}>
        {/* Store ID 입력란 제거, URL에서 자동으로 받아온 storeId를 사용 */}
        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={review.rating}
            onChange={handleChange}
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
            value={review.reviewComment}
            onChange={handleChange}
            placeholder="리뷰를 작성해주세요."
            required
          />
        </div>
        <button type="submit">리뷰 작성</button>
      </form>
    </div>
  );
};

export default Review;
