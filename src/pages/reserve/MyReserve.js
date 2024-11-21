import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllReservationsByUserId } from "../../webapi/webApiList"; // API 호출 함수 추가

const MyReserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [reservations, setReservations] = useState([]); // 예약 정보 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

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
      getAllReservationsByUserId(userInfo.id) // StoreInfo.js에서 사용했던 함수를 사용
        .then((res) => {
          console.log("예약 목록:", res); // API 응답 확인
          if (res && Array.isArray(res)) {
            setReservations(res); // 예약 목록 상태 업데이트
          } else {
            setReservations([]); // 예약이 없으면 빈 배열로 처리
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

  const reserveStatus = (status) => {
    console.log(status);
    switch (status) {
      case '0':
        return "예약대기";
      case '1':
        return "예약확정";
      case '2':
        return "완료";
      case '3':
        return "예약취소";
      default:
        return "";
    }
  }

  return (
    <div className="my-reserve">
      <h4>나의 예약 정보</h4>
      {loading ? (
        <p>로딩 중...</p>
      ) : reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <div className="reserve-card-container">
          {reservations.map((reservation) => (
            <Card
              key={reservation.reserveId} // reservationId를 키로 사용
              style={{ width: "18rem", margin: "10px" }}
            >
              <Card.Body>
                <Card.Title>가게 이름: {reservation.storeName}</Card.Title>
                <Card.Text>
                  <strong>예약 날짜:</strong>{" "}
                  {new Date(reservation.reserveDate).toLocaleString()} <br />
                  <strong>인원 수:</strong> {reservation.partySize} <br />
                  <strong>상태:</strong> {reserveStatus(reservation.reserveStatus)}
                </Card.Text>
                {/* 완료 상태일 때만 리뷰작성 버튼 생성 */}
                {reservation.reserveStatus === '2' && (
                  <Link
                    to={`/writeReview/${reservation.storeId}/${reservation.reserveId}`}
                  >
                    리뷰 작성
                  </Link>
                )}
                
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReserve;
