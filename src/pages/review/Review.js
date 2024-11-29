import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import {
  DeleteFileButton,
  DivStar,
  FileImage,
  FileItem,
  FileLibel,
  FileList,
  FileUploadButton,
  FileUploadSection,
  RatingFormGroup,
  RatingLabel,
  ReviewCommentFormGroup,
  ReviewCommentLabel,
  ReviewCommentTextArea,
  ReviewContainer,
  ReviewTitle,
  SubmitButton,
  Username,
} from "../../components/Review/ReviewStyle";
import { Card, Col, Form, Row } from "react-bootstrap";

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
    // 선택된 파일이 없을 경우
    if (selectedFiles.length === 0) {
      Swal.fire({
        title: "파일 선택 오류",
        text: "선택된 파일이 없습니다.",
        icon: "warning",
      });
      return; // 함수 종료
    }

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
      })
      .catch((error) => {
        Swal.fire({
          title: "파일 업로드 실패",
          text: "파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
          icon: "error",
        });
        console.error(error);
      });
  };

  const deleteFile = (file) => {
    // 삭제 확인 팝업 띄우기
    console.log({
      id: file.id, // 파일 ID
      fileTarget: userInfo.username, // 파일 소유자
      reserveId: review.reserveId, // 예약 ID
    });
    Swal.fire({
      title: "정말로 이 파일을 삭제하시겠습니까?",
      text: "삭제된 파일은 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // 사용자가 삭제를 확인한 경우에만 파일 삭제
        instance
          .post("/file/delete", {
            id: file.id, // 파일 ID
            fileTarget: userInfo.username, // 파일 소유자
            reserveId: review.reserveId, // 예약 ID
          })
          .then((res) => {
            if (res.status === 200) {
              // 파일 삭제 후 상태 업데이트
              const files = fileList.filter((item) => item.id !== file.id);
              setFileList([...files]);
              // setReview((prevReview) => {
              //   const updatedFiles = prevReview.files.filter(
              //     (item) => item.id !== file.id
              //   );
              //   return { ...prevReview, files: updatedFiles }; // 새로운 파일 목록을 포함한 상태 반환
              // });

              Swal.fire({
                title: "성공",
                text: "파일이 삭제되었습니다.",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error("파일 삭제 오류:", error);
            Swal.fire({
              title: "실패",
              text: "파일 삭제에 실패했습니다.",
              icon: "error",
            });
          });
      } else {
        // 사용자가 취소한 경우
        Swal.fire({
          title: "취소",
          text: "파일 삭제가 취소되었습니다.",
          icon: "info",
        });
      }
    });
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

  // 빈별 SVG
  const EmptyStar = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      fill=""
      viewBox="0 0 16 16"
    >
      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
    </svg>
  );

  // 채워진 별 SVG
  const FilledStar = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      fill="gold"
      viewBox="0 0 16 16"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  );

  // 별 클릭 처리
  const handleStarClick = (ratingValue) => {
    setReview({ ...review, rating: ratingValue });
  };

  return (
    <ReviewContainer>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <ReviewTitle>
              <Username>{userInfo.username}</Username> 고객님 리뷰 작성
            </ReviewTitle>

            <Form onSubmit={handleSubmit}>
              <RatingFormGroup controlId="rating">
                <RatingLabel>Rating:</RatingLabel>
                <DivStar>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      key={value}
                      onClick={() => handleStarClick(value)}
                      style={{ cursor: "pointer" }}
                    >
                      {review.rating >= value ? <FilledStar /> : <EmptyStar />}
                    </span>
                  ))}
                </DivStar>
              </RatingFormGroup>

              <ReviewCommentFormGroup
                controlId="reviewComment"
                className="mb-4"
              >
                <ReviewCommentLabel>Review Comment:</ReviewCommentLabel>
                <ReviewCommentTextArea
                  as="textarea"
                  name="reviewComment"
                  value={review.reviewComment}
                  onChange={(e) =>
                    setReview({ ...review, reviewComment: e.target.value })
                  }
                  placeholder="음식의 맛과 식당 분위기에 대해 자유롭게 작성해주세요. 추천 메뉴나 서비스에 대한 의견도 환영합니다."
                  required
                  className="form-control"
                />
              </ReviewCommentFormGroup>

              <SubmitButton variant="danger" type="submit">
                리뷰 작성
              </SubmitButton>
            </Form>

            <FileUploadSection className="mt-5">
              <FileLibel>첨부 파일:</FileLibel>
              <input
                className="file-input mb-3"
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
              <FileUploadButton
                variant="warning"
                className="mb-3"
                onClick={handleFileUpload}
              >
                업로드
              </FileUploadButton>

              <FileList>
                {fileList.map((item) => (
                  <FileItem key={item.id}>
                    <FileImage
                      src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                      alt="첨부파일"
                    />
                    <DeleteFileButton
                      variant="danger"
                      size="sm"
                      className="mt-2"
                      onClick={() => deleteFile(item)}
                    >
                      삭제
                    </DeleteFileButton>
                  </FileItem>
                ))}
              </FileList>
            </FileUploadSection>
          </Card>
        </Col>
      </Row>
    </ReviewContainer>
  );
};

export default Review;
