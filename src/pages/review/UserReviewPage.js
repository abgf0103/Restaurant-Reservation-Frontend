import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import {
  InfoIconContainer,
  ListGroupItem,
  MiniTitle,
  Name,
  ProfileImage,
  UserReviewCard,
  UserReviewImage,
  UserReviewPageContainer,
  UserReviewTitle,
  WLSumContainer,
  WLSumItem,
} from "../../components/Review/UserReviewPageStyle"; // MyReviewStyle에서 스타일 임포트
import {
  Card,
  CardText,
  Col,
  ListGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaPenToSquare } from "react-icons/fa6";
import { FaHeart, FaTrophy } from "react-icons/fa";

const UserReviewPage = () => {
  const { username } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 시작은 1로 설정
  const [reviewsPerPage] = useState(4); // 한 페이지에 표시할 리뷰 개수
  const [name, setName] = useState();
  const [likeSum, setLikeSum] = useState(0);
  const [ranking, setRanking] = useState(null); // 랭킹 상태 추가

  useEffect(() => {
    instance
      .get(`/review/view-by-username/${username}`)
      .then((res) => {
        const reviewsWithFiles = res.data.data.map((review) => ({
          ...review,
          files: review.files || [],
        }));
        setReviews(reviewsWithFiles);
        setName(reviewsWithFiles[0].name);

        // likeCount 값을 모두 더하여 likeSum 상태에 저장
        let totalLikes = 0; // 총 좋아요 수를 저장할 변수
        reviewsWithFiles.forEach((review) => {
          totalLikes += review.likeCount; // 각 리뷰의 likeCount 값을 더함
        });
        setLikeSum(totalLikes); // 총 좋아요 수 업데이트

        // 콘솔에 리뷰 리스트 출력
        console.log("User Reviews:", reviewsWithFiles);
        // 랭킹을 불러오는 함수 호출
        fetchUserRanking();
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
  }, [username]); // username이 변경될 때마다 실행

  // 사용자 랭킹 가져오기
  const fetchUserRanking = () => {
    instance
      .get(`/review/UserLikedRanking/${username}`) // 랭킹 API 호출
      .then((response) => {
        console.log(response);
        const userRanking = response.data; // 랭킹 데이터
        setRanking(userRanking); // 랭킹 상태 업데이트
      })
      .catch((error) => {
        console.error("사용자 랭킹 가져오기 실패:", error);
        Swal.fire({
          title: "실패",
          text: "사용자 랭킹을 가져오는 데 실패했습니다.",
          icon: "error",
        });
      });
  };

  // 정보 아이콘 클릭 시 팝업을 띄우는 함수
  const handleInfoClick = () => {
    Swal.fire({
      title: "리뷰 통계 정보",
      html: `
        <p><strong>작성된 리뷰 수:</strong> ${reviews.length}개</p>  
        <p><strong>내가 받은 좋아요 수:</strong> ${likeSum}개</p>    
        <p><strong>현재 사용자 랭킹:</strong> ${
          ranking ? ranking : "불러오는 중..."
        }</p>
        <br />
        
        <!-- 받은 좋아요 수와 랭킹에 대한 더 구체적이고 직관적인 설명 추가 -->
        <p><em>참고:</em> 내가 받은 좋아요 수는 <strong>내가 작성한 모든 리뷰에서 받은 좋아요의 총합</strong>을 의미합니다. <strong>모든 리뷰의 좋아요를 합산하여 표시</strong>됩니다.</p>
        <p><em>현재 사용자 랭킹:</em> 내 리뷰에 달린 <strong>좋아요 수</strong>를 기준으로 순위가 매겨집니다. <strong>내가 받은 모든 리뷰에서의 좋아요 수 총합</strong>을 반영하여, 다른 사용자들과의 비교를 통해 순위가 결정됩니다.</p>
      `,
      icon: "info",
      confirmButtonText: "확인",
    });
  };

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

  // 페이지네이션 처리 (현재 페이지에 맞는 리뷰만 표시)
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // pageCount 계산
  const pageCount = Math.ceil(reviews.length / reviewsPerPage);

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1); // 첫 페이지로 이동
    } else if (pageNumber > pageCount) {
      setCurrentPage(pageCount); // 마지막 페이지로 이동
    } else {
      setCurrentPage(pageNumber); // 정상적인 페이지로 이동
    }
  };

  return (
    <UserReviewPageContainer>
      <UserReviewTitle>
        <ProfileImage>
          {reviews[0].fileId ? (
            <img
              src={`${process.env.REACT_APP_HOST}/file/viewId/${reviews[0].fileId}`}
              alt="프로필 사진"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--primary-color)",
              }}
            />
          ) : (
            <FontAwesomeIcon
              className="mypage-default-icon"
              icon={faCircleUser} // 기본 아이콘
              style={{
                fontSize: "50px", // 적당한 크기로 설정
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            />
          )}
          <div>
            <div>
              <Name>{name}</Name> 님 리뷰 목록
            </div>
            <div>
              <WLSumContainer>
                {/* 정보 아이콘 맨 앞에 배치 */}
                <InfoIconContainer onClick={handleInfoClick}>
                  <IoIosInformationCircleOutline />
                </InfoIconContainer>

                {/* WLSum 항목들 */}
                <WLSumItem>
                  <FaPenToSquare /> : {reviews.length}
                </WLSumItem>
                <WLSumItem>
                  <FaHeart /> : {likeSum}
                </WLSumItem>
                <WLSumItem>
                  <FaTrophy /> : {ranking ? ranking : "Not ranked"}
                </WLSumItem>
              </WLSumContainer>
            </div>
          </div>
        </ProfileImage>
      </UserReviewTitle>
      <Row className="row-eq-height">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
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
      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: pageCount }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
        />
        <Pagination.Last
          onClick={() => handlePageChange(pageCount)}
          disabled={currentPage === pageCount}
        />
      </Pagination>
    </UserReviewPageContainer>
  );
};

export default UserReviewPage;
