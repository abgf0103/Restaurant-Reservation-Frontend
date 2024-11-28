import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import { Card, ListGroup, Col, Spinner, CardText } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  ButtonDelete,
  ButtonEdit,
  ListGroupItem,
  MyReviewContainer,
  MyReviewTitle,
  ReviewButtons,
  ReviewCard,
  ReviewImage,
  ReviewRow,
  Username,
} from "../../components/Review/MyReviewStyle";

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
        const reviewsWithFiles = res.data.map((review) => ({
          ...review,
          files: review.files || [], // 파일 정보가 없을 수 있으므로 기본값을 빈 배열로 설정
        }));
        setReviews(reviewsWithFiles); // 사용자 리뷰 목록 설정
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

  const handleDeleteClick = (reviewId, reserveId) => {
    // 삭제 확인 알림
    console.log("삭제하려는 리뷰의 reviewId:", reviewId);
    console.log("삭제하려는 리뷰의 reserveId:", reserveId);

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
            params: { userId: userInfo.id, reserveId: reserveId }, // userId와 reserveId를 쿼리 파라미터로 전달
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
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <MyReviewContainer>
      <MyReviewTitle>
        <Username>{userInfo.username}</Username> 고객님 리뷰 작성
      </MyReviewTitle>
      <ReviewRow className="row-eq-height">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Col xs={12} md={4} lg={3} key={review.reviewId} className="d-flex">
              <ReviewCard>
                <Card.Body>
                  <Card.Title>{review.storeName}</Card.Title>
                  <CardText>{review.reviewComment}</CardText>
                  <ListGroup variant="flush">
                    <ListGroupItem>별점: {review.rating} ⭐</ListGroupItem>
                    <ListGroupItem>
                      리뷰 코멘트: {review.reviewComment}{" "}
                    </ListGroupItem>
                    <ListGroupItem>
                      좋아요 수: {review.likeCount} ❤️
                    </ListGroupItem>
                  </ListGroup>
                </Card.Body>

                {/* 파일이 있다면 이미지 보여주기 */}
                {review.files.length > 0 && (
                  <ReviewImage>
                    {review.files.map((file, index) => (
                      <img
                        key={index}
                        src={`${process.env.REACT_APP_HOST}/file/view/${file.saveFileName}`}
                        alt={`첨부 파일 ${index + 1}`}
                        className="img-fluid"
                      />
                    ))}
                  </ReviewImage>
                )}

                <ReviewButtons>
                  <ButtonEdit
                    variant="outline-primary"
                    onClick={() => handleEditClick(review.reviewId)}
                  >
                    <FaEdit style={{ marginRight: "8px" }} /> 수정
                  </ButtonEdit>
                  <ButtonDelete
                    variant="outline-danger"
                    onClick={() =>
                      handleDeleteClick(review.reviewId, review.reserveId)
                    }
                  >
                    <FaTrashAlt style={{ marginRight: "8px" }} /> 삭제
                  </ButtonDelete>
                </ReviewButtons>
              </ReviewCard>
            </Col>
          ))
        ) : (
          <p>작성된 리뷰가 없습니다.</p>
        )}
      </ReviewRow>
    </MyReviewContainer>
  );
};

export default MyReview;
