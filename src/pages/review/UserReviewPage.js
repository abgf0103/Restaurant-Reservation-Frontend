import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 임포트
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import {
  ButtonEdit,
  FileImage,
  Header,
  PageContainer,
  ReviewButtons,
  ReviewCard,
  ReviewImage,
} from "../../components/Review/UserReviewPageStyle";
import { Card, Col, ListGroup, Row } from "react-bootstrap";

const UserReviewPage = () => {
  const { username } = useParams(); // URL에서 username을 받음
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 특정 사용자의 리뷰 목록을 가져오는 API 요청
    instance
      .get(`/review/view-by-username/${username}`) // 새로운 API 호출
      .then((res) => {
        console.log(res);
        const reviewsWithFiles = res.data.data.map((review) => ({
          ...review,
          files: review.files || [], // 파일 목록이 없을 수 있으므로 기본값을 빈 배열로 설정
        }));
        setReviews(reviewsWithFiles); // 'data' 필드 안에 리뷰 목록이 있으므로
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
  }, [username]); // username이 바뀔 때마다 다시 API 호출

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageContainer>
      <Header>{username} 사용자님의 리뷰 페이지</Header>
      <Row xs={1} sm={2} md={3} className="g-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Col key={review.reviewId}>
              <ReviewCard>
                <Card.Body>
                  <Card.Title>{review.storeName}</Card.Title>
                  <Card.Text>{review.reviewComment}</Card.Text>
                  <ListGroup variant="flush">
                    <ListGroup.Item>별점: {review.rating} ⭐</ListGroup.Item>
                  </ListGroup>
                </Card.Body>

                {/* 파일이 있다면 이미지 보여주기 */}
                {review.files.length > 0 && (
                  <FileImage>
                    {review.files.map((file, index) => (
                      <img
                        key={index}
                        src={`${process.env.REACT_APP_HOST}/file/view/${file.saveFileName}`}
                        alt={`첨부 파일 ${index + 1}`}
                        className="img-fluid"
                      />
                    ))}
                  </FileImage>
                )}
              </ReviewCard>
            </Col>
          ))
        ) : (
          <p>이 사용자는 작성한 리뷰가 없습니다.</p>
        )}
      </Row>
    </PageContainer>
  );
};

export default UserReviewPage;
