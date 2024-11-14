import React, { useState, useEffect } from "react";
import instance from "../../api/instance";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";

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
      instance
        .get("/reservations/user")
        .then((res) => {
          console.log("User Info:", userInfo);
          console.log("Reservations:", res.data);
          setReservations(res.data); // 가져온 예약 정보를 상태에 저장
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
          setLoading(false);
        });
    }
  }, [userInfo, navigate]);

  return (
    <div className="my-reserve">
      <h4>나의 예약 정보</h4>
      {loading ? (
        <p>로딩 중...</p>
      ) : reservations.length === 0 ? ( // 예약 내역이 없을 때 조건 수정
        <p>예약 내역이 없습니다.</p>
      ) : (
        <div className="reserve-card-container">
          {reservations.map((reservation) => (
            <Card
              key={reservation.reservationId}
              style={{ width: "18rem", margin: "10px" }}
            >
              <Card.Body>
                <Card.Title>가게 이름: {}</Card.Title>
                <Card.Text>
                  <strong>가게 ID:</strong> {reservation.storeId} <br />
                  <strong>예약 날짜:</strong>{" "}
                  {new Date(reservation.reserveDate).toLocaleString()} <br />
                  <strong>인원 수:</strong> {reservation.partySize} <br />
                  <strong>상태:</strong> {reservation.reserveStatus}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReserve;
