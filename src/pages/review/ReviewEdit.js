import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../../hooks/tokenSlice";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance";
import { Form, Row, Col, Card } from "react-bootstrap";
import {
  DeleteFileButton,
  FileImage,
  FileItem,
  FileList,
  FileUploadButton,
  FileUploadSection,
  H1,
  RatingFormGroup,
  RatingInput,
  RatingLabel,
  ReveiwContainer,
  ReviewCommentFormGroup,
  ReviewCommentLabel,
  ReviewCommentTextArea,
  SubmitButton,
} from "../../components/Review/ReviewEditStyle";

const ReviewEdit = () => {
  const { reviewId } = useParams(); // URL에서 reviewId를 가져옴
  const navigate = useNavigate();
  const tokenInfo = useSelector(getTokenInfo);
  const userInfo = useSelector(getUserInfo);

  const [review, setReview] = useState({
    createdAt: "",
    files: [], // 기존 첨부된 파일 목록
    likeCount: 0,
    rating: 0,
    reserveId: 0,
    reviewComment: "",
    reviewId: 0,
    storeId: 0,
    storeName: "",
    updatedAt: "",
    userId: 0,
    username: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]); // 새로 선택한 파일 목록
  const [fileList, setFileList] = useState([]); // 업로드된 새 파일 목록 (ID 포함)

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
          setReview(data);
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

  const findDuplicates = (arr) => {
    const count = {};
    const duplicates = [];

    // id 빈도 계산
    arr.forEach((obj) => {
      count[obj.id] = (count[obj.id] || 0) + 1;
    });

    // 빈도가 2 이상인 id만 추출
    for (let id in count) {
      if (count[id] > 1) {
        duplicates.push(Number(id)); // id는 숫자형이므로 숫자로 변환하여 추가
      }
    }

    return duplicates;
  };

  // 리뷰 수정 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 새로 업로드된 파일을 fileList에서 가져오고 기존의 파일과 합친 ID 목록을 만들어서 전송
    let concatFileList = [...review.files, ...fileList];

    // 중복된 fileid만 남기기
    concatFileList = findDuplicates(concatFileList);

    const formData = {
      storeId: review.storeId,
      rating: review.rating,
      reviewComment: review.reviewComment,
      userId: userInfo.userId,
      username: userInfo.username, // username 추가
      files: concatFileList, // 기존 파일 ID들 + 새로 업로드된 파일 ID들
    };

    // API 요청하여 리뷰 수정
    instance
      .put(`/review/update/${reviewId}`, formData)
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
    return <div className="loading-text">로딩 중...</div>;
  }

  const deleteFile = (file) => {
    // Swal로 삭제 확인 팝업 띄우기
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
            id: file.id,
            fileTarget: file.fileTarget,
            reserveId: review.reserveId,
          })
          .then((res) => {
            if (res.status === 200) {
              // 파일 삭제 후 상태 업데이트
              setReview((prevReview) => {
                const updatedFiles = prevReview.files.filter(
                  (item) => item.id !== file.id
                );
                return { ...prevReview, files: updatedFiles }; // 새로운 파일 목록을 포함한 상태 반환
              });

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

  // 파일 선택
  const handleFileChange = (e) => {
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
        setSelectedFiles([]); // 선택된 파일 초기화
        const newFiles = res.data; // 업로드된 새 파일 정보

        // 기존 파일들과 새로 업로드된 파일을 합침
        const tmpFile = [...review.files, ...newFiles];

        setFileList([...fileList, ...newFiles]); // 업로드된 파일 목록 상태로 업데이트
        setReview({
          ...review,
          files: tmpFile, // 기존 파일 + 새로 업로드된 파일 목록
        });
      })
      .catch((error) => {
        console.error("파일 업로드 오류:", error);
        Swal.fire({
          title: "실패",
          text: "파일 업로드에 실패했습니다.",
          icon: "error",
        });
      });
  };

  return (
    <ReveiwContainer>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <H1>{userInfo.username} 고객님 리뷰 수정</H1>

            <Form onSubmit={handleSubmit}>
              <RatingFormGroup controlId="rating" className="mb-4">
                <RatingLabel>Rating:</RatingLabel>
                <RatingInput
                  type="number"
                  name="rating"
                  value={review.rating}
                  onChange={(e) =>
                    setReview({ ...review, rating: e.target.value })
                  }
                  min="1"
                  max="5"
                  placeholder="1에서 5 사이로 평가해주세요."
                  required
                  className="form-control"
                />
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
                  placeholder="리뷰를 작성해주세요."
                  required
                  className="form-control"
                />
              </ReviewCommentFormGroup>

              <SubmitButton
                variant="danger"
                type="submit"
                className="submit-button"
              >
                리뷰 수정
              </SubmitButton>
            </Form>

            {/* 파일 첨부 부분 */}
            {review.files.length > 0 && (
              <FileUploadSection className="mt-5">
                <Form.Label>첨부 파일:</Form.Label>
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
                  {review.files.map((fileItem) => (
                    <FileItem key={fileItem.id}>
                      <FileImage
                        src={`${process.env.REACT_APP_HOST}/file/view/${fileItem.saveFileName}`}
                        alt={`첨부 파일 ${fileItem.id}`}
                      />
                      <DeleteFileButton
                        variant="danger"
                        size="sm"
                        className="mt-2"
                        onClick={() => deleteFile(fileItem)}
                      >
                        삭제
                      </DeleteFileButton>
                    </FileItem>
                  ))}
                </FileList>
              </FileUploadSection>
            )}
          </Card>
        </Col>
      </Row>
    </ReveiwContainer>
  );
};

export default ReviewEdit;
