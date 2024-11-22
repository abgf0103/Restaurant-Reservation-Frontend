import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllReservationsByUserId } from "../../webapi/webApiList"; // API 호출 함수 추가
import instance from "../../api/instance"; // Axios instance
import { reserveStatus } from "./../../utils/tools";

const MyReserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [reservations, setReservations] = useState([]); // 예약 정보 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [reviewExistMap, setReviewExistMap] = useState({}); // 리뷰 여부 상태 관리

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
                <Card.Title>
                  {"가게 이름 : " + reservation.storeName}
                </Card.Title>
                <Card.Text>
                  <strong>예약 날짜:</strong>{" "}
                  {new Date(reservation.reserveDate).toLocaleString()} <br />
                  <strong>인원 수:</strong> {reservation.partySize} <br />
                  <strong>상태:</strong>{" "}
                  {reserveStatus(reservation.reserveStatus)}
                </Card.Text>
                {/* 완료 상태일 때만 리뷰작성 버튼 또는 리뷰 작성 완료 메시지 */}
                {reservation.reserveStatus === 2 &&
                  (reviewExistMap[reservation.reserveId] ? (
                    <p>{"리뷰 작성 완료 :)"}</p>
                  ) : (
                    <Link
                      to={`/writeReview/${reservation.storeId}/${reservation.reserveId}`}
                    >
                      리뷰 작성
                    </Link>
                  ))}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReserve;
