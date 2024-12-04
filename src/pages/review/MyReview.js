import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보
import Swal from "sweetalert2";
import instance from "../../api/instance"; // instance 임포트
import { Card, ListGroup, Col, Spinner, CardText, Row } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaTrophy, FaHeart } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Pagination } from "react-bootstrap";
import {
  ButtonDelete,
  ButtonEdit,
  InfoContainer,
  InfoIcon,
  ListGroupItem,
  MiniTitle,
  MyReviewContainer,
  MyReviewTitle,
  ProfileImage,
  ReviewButtons,
  ReviewCard,
  ReviewImage,
  Username,
  WLSum,
} from "../../components/Review/MyReviewStyle";

const MyReview = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeSum, setLikeSum] = useState(0);
  const [ranking, setRanking] = useState(null); // 랭킹 상태 추가
  const [currentPage, setCurrentPage] = useState(1); // 페이지 시작은 1로 설정
  const [reviewsPerPage] = useState(4); // 한 페이지에 표시할 리뷰 개수

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

        // likeCount 값을 모두 더하여 likeSum 상태에 저장
        let totalLikes = 0; // 총 좋아요 수를 저장할 변수
        reviewsWithFiles.forEach((review) => {
          totalLikes += review.likeCount; // 각 리뷰의 likeCount 값을 더함
        });
        setLikeSum(totalLikes); // 총 좋아요 수 업데이트
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

  // 사용자 랭킹 가져오기
  const fetchUserRanking = () => {
    instance
      .get("/review/LikedRanking") // 랭킹 API 호출
      .then((response) => {
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

  useEffect(() => {
    fetchMyReviews();
    fetchUserRanking(); // 랭킹 API 호출 추가
  }, []); // 처음 한 번만 호출

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

  // 별점을 처리하는 함수
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? (
          <svg
            key={`star-${i}`} // 각 별에 고유 key 추가
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
            key={`star-${i}`} // 각 별에 고유 key 추가
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill=""
            viewBox="0 0 16 16"
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
          </svg>
        )
      );
    }
    return stars;
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
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <MyReviewContainer>
      <MyReviewTitle>
        <ProfileImage>
          {userInfo.fileId && (
            <img
              src={`${process.env.REACT_APP_HOST}/file/viewId/${userInfo.fileId}`}
              alt="Profile"
            />
          )}
          <Username>{userInfo.username}</Username> 고객님 리뷰 목록
        </ProfileImage>
      </MyReviewTitle>
      <InfoContainer>
        <InfoIcon onClick={handleInfoClick}>
          <IoIosInformationCircleOutline />
        </InfoIcon>
      </InfoContainer>
      <WLSum>
        <span>
          <FaPenToSquare /> : {reviews.length}
        </span>
        <span>
          <FaHeart /> : {likeSum}
        </span>
        <span>
          <FaTrophy /> : {ranking ? ranking : "Not ranked"}
        </span>
      </WLSum>
      <Row className="row-eq-height">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <Col xs={12} md={4} lg={3} key={review.reviewId} className="d-flex">
              <ReviewCard>
                <div>
                  <Card.Body>
                    <MiniTitle>{review.storeName}</MiniTitle>
                    <CardText>{review.reviewComment}</CardText>
                    <ListGroup variant="flush">
                      <ListGroupItem key={`rating-${review.reviewId}`}>
                        별점: {renderStars(review.rating)}
                      </ListGroupItem>
                      <ListGroupItem key={`like-${review.reviewId}`}>
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
                </div>
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
    </MyReviewContainer>
  );
};

export default MyReview;
