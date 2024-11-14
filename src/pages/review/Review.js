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

  const [canWriteReview, setCanWriteReview] = useState(true); // 리뷰 작성 가능 여부 상태

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  // 매장 예약 상태 체크
  useEffect(() => {
    instance
      .get(
        `/review/check-reserve-status?storeId=${storeId}&userId=${userInfo.id}`,
        FormData
      )
      .then((response) => {
        setCanWriteReview(response.data);
      })
      .catch((error) => {
        console.error("예약 상태 체크 오류:", error);
        Swal.fire({
          title: "실패",
          text: "예약 상태를 확인할 수 없습니다.",
          icon: "error",
        });
      });
  }, [storeId, userInfo.userId]);

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

    if (!canWriteReview) {
      Swal.fire({
        title: "리뷰 작성 불가",
        text: "예약 상태가 완료되지 않았습니다. 리뷰를 작성하려면 예약 상태가 2여야 합니다.",
        icon: "warning",
      });
      return;
    }

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
        <button type="submit" disabled={!canWriteReview}>
          리뷰 작성
        </button>
        {!canWriteReview && <p>예약 완료된 후에 리뷰작성이 가능합니다.</p>}
      </form>
    </div>
  );
};

export default Review;
