import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import {
  ListGroupItem,
  MiniTitle,
  UserReviewCard,
  UserReviewImage,
  UserReviewPageContainer,
  UserReviewRow,
  UserReviewTitle,
  Username,
} from "../../components/Review/UserReviewPageStyle"; // MyReviewStyle에서 스타일 임포트
import { Card, CardText, Col, ListGroup, Row } from "react-bootstrap";

const UserReviewPage = () => {
  const { username } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance
      .get(`/review/view-by-username/${username}`)
      .then((res) => {
        const reviewsWithFiles = res.data.data.map((review) => ({
          ...review,
          files: review.files || [],
        }));
        setReviews(reviewsWithFiles);
        // 콘솔에 리뷰 리스트 출력
        console.log("User Reviews:", reviewsWithFiles); // 여기서 출력합니다.
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
  }, [username]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 별점을 처리하는 함수
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="gold"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="bllue"
            viewBox="0 0 16 16"
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
          </svg>
        )
      );
    }
    return stars;
  };

  return (
    <UserReviewPageContainer>
      <UserReviewTitle>
        <Username>{username}</Username> 사용자님의 리뷰 페이지
      </UserReviewTitle>
      <Row className="row-eq-height">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Col xs={12} md={4} lg={3} key={review.reviewId} className="d-flex">
              <UserReviewCard>
                <div>
                  <Card.Body>
                    <MiniTitle>{review.storeName}</MiniTitle>
                    <CardText>{review.reviewComment}</CardText>
                    <ListGroup variant="flush">
                      <ListGroupItem>
                        별점: {renderStars(review.rating)}
                      </ListGroupItem>
                      <ListGroupItem>
                        좋아요 수: {review.likeCount} ❤️
                      </ListGroupItem>
                    </ListGroup>
                  </Card.Body>

                  {review.files.length > 0 && (
                    <UserReviewImage>
                      {review.files.map((file, index) => (
                        <img
                          key={index}
                          src={`${process.env.REACT_APP_HOST}/file/view/${file.saveFileName}`}
                          alt={`첨부 파일 ${index + 1}`}
                          className="img-fluid"
                        />
                      ))}
                    </UserReviewImage>
                  )}
                </div>
              </UserReviewCard>
            </Col>
          ))
        ) : (
          <p>이 사용자는 작성한 리뷰가 없습니다.</p>
        )}
      </Row>
    </UserReviewPageContainer>
  );
};

export default UserReviewPage;
