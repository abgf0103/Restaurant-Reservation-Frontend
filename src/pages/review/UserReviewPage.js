import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import {
  ListGroupItem,
  UserReviewCard,
  UserReviewImage,
  UserReviewPageContainer,
  UserReviewRow,
  UserReviewTitle,
  UserReviewCol, // 새로 추가한 UserReviewCol 임포트
} from "../../components/Review/UserReviewPageStyle"; // MyReviewStyle에서 스타일 임포트
import { Card, CardText, ListGroup } from "react-bootstrap";

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

  return (
    <UserReviewPageContainer>
      <UserReviewTitle>{username} 사용자님의 리뷰 페이지</UserReviewTitle>
      <UserReviewRow>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <UserReviewCol key={review.reviewId}>
              <UserReviewCard>
                <Card.Body>
                  <Card.Title>{review.storeName}</Card.Title>
                  <CardText>{review.reviewComment}</CardText>
                  <ListGroup variant="flush">
                    <ListGroupItem>별점: {review.rating} ⭐</ListGroupItem>
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
              </UserReviewCard>
            </UserReviewCol>
          ))
        ) : (
          <p>이 사용자는 작성한 리뷰가 없습니다.</p>
        )}
      </UserReviewRow>
    </UserReviewPageContainer>
  );
};

export default UserReviewPage;
