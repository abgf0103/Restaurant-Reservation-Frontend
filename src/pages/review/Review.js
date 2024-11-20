import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트

const Review = () => {
  const navigate = useNavigate();
  const { storeId, reserveId } = useParams(); // URL에서 storeId, reserveId 추출
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [review, setReview] = useState({
    storeId: storeId, // storeId는 URL 파라미터에서 자동으로 받아옴
    rating: "",
    reviewComment: "",
  });

  const [canWriteReview, setCanWriteReview] = useState(true); // 리뷰 작성 가능 여부 상태
  const [isReviewExist, setIsReviewExist] = useState(false); // 중복 리뷰 여부 상태

  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일 목록
  const [fileList, setFileList] = useState([]); // 업로드된 파일 목록

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  // 매장 예약 상태 체크 및 중복 리뷰 여부 체크
  useEffect(() => {
    if (userInfo.id && storeId && reserveId) {
      // 예약 상태 체크
      instance
        .get(
          `/review/check-reserve-status?storeId=${storeId}&userId=${userInfo.id}&reserveId=${reserveId}`
        )
        .then((response) => {
          console.log(response);
          setCanWriteReview(response.data); // 예약 상태에 따라 리뷰 작성 가능 여부 설정

          if (!response.data?.success) {
            // 작성불가
            Swal.fire({
              title: "리뷰 작성 불가",
              text: "예약이 완료된 후에 리뷰 작성을 할 수 있습니다.",
              icon: "warning",
              confirmButtonText: "확인",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/user/myreserve"); // 예약 목록 페이지로 이동
              }
            });
          }
        });

      // 중복 리뷰 여부 체크
      instance
        .get(
          `/review/check-exist?storeId=${storeId}&userId=${userInfo.id}&reserveId=${reserveId}`
        )
        .then((response) => {
          setIsReviewExist(response.data); // 중복 리뷰 여부 설정
          // 이미 리뷰를 작성한 경우 경고창 띄우기
          if (response.data) {
            Swal.fire({
              title: "리뷰 중복 작성 불가",
              text: "이미 이 예약에 대한 리뷰를 작성하셨습니다.",
              icon: "warning", // warning 아이콘 사용
              confirmButtonText: "확인", // 확인 버튼 텍스트 설정
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/user/myreserve"); // 예약 목록 페이지로 이동
              }
            });
          }
        })
        .catch((error) => {
          console.error("중복 리뷰 체크 오류:", error);
        });
    }
  }, [storeId, reserveId, userInfo.id, navigate]);

  // 리뷰 작성 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 파일 선택
  const handleFileChange = (e) => {
    console.log(e.target.files);
    setSelectedFiles((prevState) => [
      ...prevState,
      ...Array.from(e.target.files),
    ]);
  };

  // 파일 업로드
  const handleFileUpload = () => {
    console.log("파일 업로드");
    const formData = new FormData();
    formData.append("fileTarget", userInfo.username);

    selectedFiles.forEach((file) => formData.append("files", file));

    instance
      .post("/file/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setFileList(res.data); // 업로드한 파일 목록을 상태로 설정
      });
  };

  // 파일 삭제
  const fileDelete = (id) => {
    instance
      .post("/file/delete", { id })
      .then((res) => {
        if (res.status === 200) {
          const result = fileList.filter((item) => item.id !== id);
          setFileList(result); // 파일 목록 업데이트
        }
      })
      .catch((error) => console.error("파일 삭제 오류:", error));
  };

  // 리뷰 저장하기 (백엔드로 POST 요청)
  const handleSubmit = (e) => {
    e.preventDefault();

    // 예약 상태 체크: 리뷰 작성 가능 여부 확인
    if (!canWriteReview) {
      Swal.fire({
        title: "리뷰 작성 불가",
        text: "예약 완료된 후에 리뷰작성이 가능합니다.",
        icon: "warning", // warning 아이콘 사용
        confirmButtonText: "확인", // 확인 버튼 텍스트 설정
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/user/myreserve"); // 예약 목록 페이지로 이동
        }
      });
      return;
    }

    // 중복 리뷰 체크: 이미 리뷰를 작성한 경우
    if (isReviewExist) {
      Swal.fire({
        title: "리뷰 작성 불가",
        text: "이미 이 예약에 대한 리뷰를 작성하셨습니다.",
        icon: "warning", // warning 아이콘 사용
        confirmButtonText: "확인", // 확인 버튼 텍스트 설정
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/user/myreserve"); // 예약 목록 페이지로 이동
        }
      });
      return;
    }

    const requst = {
      storeId: review.storeId,
      rating: review.rating,
      reviewComment: review.reviewComment,
      userId: userInfo.id, // userId를 보내는 부분
      username: userInfo.username, // username 추가
      reserveId: reserveId, // 예약 ID도 함께 보내기
      files: fileList.map((file) => file.id), // 업로드된 파일 ID들
    };
    console.log(requst);

    // 리뷰 저장 API 호출
    instance
      .post("/review/save", requst)
      .then((res) => {
        Swal.fire({
          title: "성공",
          text: "리뷰가 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인", // 확인 버튼 텍스트 설정
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/user/myreserve"); // 예약 목록 페이지로 이동
          }
        });
      })
      .catch((error) => {
        console.error("리뷰 저장 오류:", error);
        Swal.fire({
          title: "실패",
          text: "리뷰 저장에 실패했습니다.",
          icon: "error", // error 아이콘 사용
          confirmButtonText: "확인", // 확인 버튼 텍스트 설정
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/user/myreserve"); // 예약 목록 페이지로 이동
          }
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

        {/* 파일 업로드 부분 */}
        <div>
          <label>첨부 파일:</label>
          <input type="file" multiple onChange={handleFileChange} />
          <button type="button" onClick={handleFileUpload}>
            업로드
          </button>
          <h3>첨부된 파일 목록</h3>
          <ul>
            {fileList.map((item) => (
              <li key={item.id}>
                <img
                  src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                  alt="첨부파일"
                  style={{ width: "100px" }}
                />
                <button type="button" onClick={() => fileDelete(item.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">리뷰 작성</button>
      </form>
    </div>
  );
};

export default Review;
