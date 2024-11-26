import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import { Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllReservationsByUserId } from "../../webapi/webApiList"; // API 호출 함수 추가
import instance from "../../api/instance"; // Axios instance
import PaginatedList from "../../components/PaginatedList";
import "./css/MyReserve.css";

const MyReserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [reservations, setReservations] = useState([]); // 예약 정보 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [reviewExistMap, setReviewExistMap] = useState({}); // 리뷰 여부 상태 관리
  const [filteredReservations, setFilteredReservations] = useState([]); // 필터링된 예약 정보
  const [filterStatus, setFilterStatus] = useState("all"); // 필터 상태

  // 예약 상태와 사용자 정보 확인 및 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      Swal.fire({
        title: "권한 없음",
        text: "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
        icon: "warning",
      }).then(() => {
        navigate("/user/login");
      });
    } else {
      // 로그인된 사용자 정보로 예약 목록 가져오기
      getAllReservationsByUserId(userInfo.id)
        .then((res) => {
          console.log("예약 목록:", res); // API 응답 확인
          if (res && Array.isArray(res)) {
            setReservations(res); // 예약 목록 상태 업데이트
            setFilteredReservations(res); // 필터링된 예약 목록 초기화

            // 각 예약에 대한 리뷰 존재 여부를 확인
            res.forEach((reservation) => {
              checkIfReviewExists(
                reservation.storeId,
                userInfo.id,
                reservation.reserveId
              );
            });
          } else {
            setReservations([]); // 예약이 없으면 빈 배열로 처리
            setFilteredReservations([]); // 필터링된 예약 목록도 빈 배열로 처리
          }
        })
        .catch((error) => {
          console.error("예약 정보 가져오기 실패:", error);
          Swal.fire({
            title: "실패",
            text: "예약 정보를 불러오는 데 실패했습니다.",
            icon: "error",
          });
        })
        .finally(() => {
          setLoading(false); // 로딩 완료
        });
    }
  }, [userInfo, navigate]);

  // 리뷰 존재 여부 체크 함수
  const checkIfReviewExists = (storeId, userId, reserveId) => {
    instance
      .get(
        `/review/check-exist?storeId=${storeId}&userId=${userId}&reserveId=${reserveId}`
      )
      .then((response) => {
        setReviewExistMap((prev) => ({
          ...prev,
          [reserveId]: response.data, // reserveId를 키로 하여 리뷰 여부 저장
        }));
      })
      .catch((error) => {
        console.error("리뷰 여부 체크 실패:", error);
      });
  };

  // 예약 취소 함수
  const deleteReservation = (reserveId, reserveDate) => {
    const today = new Date();
    const reservationDate = new Date(reserveDate);
    const differenceInTime = reservationDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 3) {
      Swal.fire({
        title: "취소 불가",
        text: "예약 날짜 3일 전까지만 취소가 가능합니다.",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "예약 취소",
      text: "정말로 이 예약을 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "예, 취소합니다.",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .delete(`/reservations/delete/${reserveId}`)
          .then(() => {
            Swal.fire(
              "취소됨!",
              "예약이 성공적으로 취소되었습니다.",
              "success"
            );
            // 예약 상태를 다시 불러와 업데이트
            setReservations((prevReservations) =>
              prevReservations.map((reservation) =>
                reservation.reserveId === reserveId
                  ? { ...reservation, reserveStatus: 3 } // 상태를 취소 상태(3)로 변경
                  : reservation
              )
            );
          })
          .catch((error) => {
            console.error("예약 취소 실패:", error);
            Swal.fire("실패", "예약 취소에 실패했습니다.", "error");
          });
      }
      window.location.reload();
    });
  };

  // 예약 필터링 함수
  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if (status === "all") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(
        reservations.filter(
          (reservation) => parseInt(status) === reservation.reserveStatus
        )
      );
    }
  };

  console.log(reservations);

  return (
    <div className="my-reserve">
      <h4>나의 예약 정보</h4>
      <Form.Group controlId="filterStatus" className="filter-status">
        <Form.Label>예약 상태 선택 : </Form.Label>
        <Form.Control
          as="select"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="all">전체</option>
          <option value="0">확인 중인 예약</option>
          <option value="1">확정된 예약</option>
          <option value="2">완료된 예약</option>
          <option value="3">취소된 예약</option>
        </Form.Control>
      </Form.Group>
      {loading ? (
        <p>로딩 중...</p>
      ) : filteredReservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <PaginatedList
          items={filteredReservations}
          itemsPerPage={10}
          renderItem={(reservation) => (
            <Card
              key={reservation.reserveId}
              style={{ width: "18rem", margin: "10px" }}
            >
              <Card.Body className="reserve-card">
                <Card.Title>{reservation.storeName}</Card.Title>
                <Card.Text>
                  <strong>예약 신청 시간 : </strong>
                  {reservation.createdAt} <br />
                  <strong>예약 날짜:</strong>{" "}
                  {new Date(reservation.reserveDate).toLocaleString()} <br />
                  <strong>인원 수:</strong> {reservation.partySize} <br />
                  {reservation.reserveStatus === 0
                    ? "예약 확인 중 입니다."
                    : reservation.reserveStatus === 1
                    ? "예약이 확정 되었습니다."
                    : reservation.reserveStatus === 2
                    ? "완료된 예약입니다."
                    : reservation.reserveStatus === 3
                    ? "취소된 예약입니다."
                    : "알 수 없는 상태"}
                </Card.Text>
                {/* 완료 상태일 때만 리뷰작성 버튼 또는 리뷰 작성 완료 메시지 */}
                {reservation.reserveStatus === 2 &&
                  (reviewExistMap[reservation.reserveId] ? (
                    <p>{"리뷰 작성 완료 :)"}</p>
                  ) : (
                    <Link
                      to={`/writeReview/${reservation.storeId}/${reservation.reserveId}`}
                    >
                      <Button variant="primary" className="review-btn">
                        리뷰 작성
                      </Button>
                    </Link>
                  ))}
                {/* 예약 상태가 취소되지 않은 경우에만 '예약 취소' 버튼 추가 */}
                {reservation.reserveStatus !== 3 &&
                  reservation.reserveStatus !== 2 && (
                    <Button
                      variant="danger"
                      className="cancel-btn"
                      onClick={() =>
                        deleteReservation(
                          reservation.reserveId,
                          reservation.reserveDate
                        )
                      }
                    >
                      예약 취소
                    </Button>
                  )}
                {/* 가게 페이지 방문 버튼 추가 */}
                <Link to={"/store/info"} state={reservation.storeId}>
                  <Button variant="secondary" className="link-btn">
                    가게 페이지 방문
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default MyReserve;
