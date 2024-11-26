import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";
import { reserveStatus } from "./../../utils/tools";
import PaginatedList from "../../components/PaginatedList";

const StoreReserve = () => {
  const { storeId } = useParams(); // URL에서 storeId 추출
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reserves, setReserves] = useState([]);
  const [storeName, setStoreName] = useState("");

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo || !userInfo.username) {
      navigate("/user/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    }
  }, [navigate, userInfo]);

  // 가게 예약 목록 가져오기
  const getStoreReserve = () => {
    instance
      .get(`/reservations/store/reserve/${storeId}`)
      .then((res) => {
        console.log(res.data);
        setReserves(res.data);
      })
      .catch((error) => {
        console.error("예약 목록 가져오기 실패:", error);
        Swal.fire("실패", "예약 목록을 가져오는 데 실패했습니다.", "error");
      });
  };

  // 가게 정보 가져오기
  const getStoreInfo = () => {
    instance
      .get(`/store/view/${storeId}`)
      .then((res) => {
        setStoreName(res.data.storeName);
      })
      .catch((error) => {
        console.error("가게 정보 가져오기 실패:", error);
      });
  };

  useEffect(() => {
    getStoreReserve();
    getStoreInfo();
  }, []);

  // 예약 상태 변경 처리 함수
  const handleStatusChange = (reserveId, newStatus) => {
    instance
      .put(
        `/reservations/update-status/${reserveId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      .then(() => {
        Swal.fire("성공", "예약 상태가 업데이트되었습니다.", "success");
        setReserves((prevReserves) =>
          prevReserves.map((reserve) =>
            reserve.reserveId === reserveId
              ? { ...reserve, reserveStatus: newStatus }
              : reserve
          )
        );
      })
      .catch((error) => {
        console.error("예약 상태 업데이트 실패:", error);
        Swal.fire("실패", "예약 상태를 업데이트하는 데 실패했습니다.", "error");
      });
  };

  // 예약 확정
  const handleConfirm = (reserveId) => {
    Swal.fire({
      title: "예약을 확정하시겠습니까?",
      text: "예약을 확정한 후 예약을 취소할 경우 불이익이 발생할 수 있습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      confirmButtonText: "예약 확정",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusChange(reserveId, 1);
      }
    });
  };

  // 예약 취소
  const handleCancel = (reserveId) => {
    Swal.fire({
      title: "예약을 취소하시겠습니까?",
      text: "예약을 취소한 후 되돌릴 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "예약 취소",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusChange(reserveId, 3);
      }
    });
  };

  // 예약 완료
  const handleComplete = (reserveId) => {
    Swal.fire({
      title: "예약이 완료되었습니까?",
      text: "예약을 완료한 후 되돌릴 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      confirmButtonText: "예약 완료",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusChange(reserveId, 2);
      }
    });
  };

  return (
    <div>
      <h1>{storeName}</h1>
      {reserves.length > 0 ? (
        <PaginatedList
          items={reserves}
          itemsPerPage={10}
          renderItem={(reserve) => (
            <Card
              key={reserve.reserveId}
              style={{ width: "18rem", margin: "10px" }}
            >
              <Card.Body>
                <Card.Title>예약 ID: {reserve.reserveId}</Card.Title>
                <Card.Text>
                  <strong>예약 날짜:</strong>{" "}
                  {new Date(reserve.reserveDate).toLocaleString()} <br />
                  <strong>인원 수:</strong> {reserve.partySize}명 <br />
                  <strong>예약 상태:</strong>{" "}
                  {reserveStatus(reserve.reserveStatus)}
                </Card.Text>
                {reserve.reserveStatus === 0 && (
                  <Button
                    variant="outline-success"
                    onClick={() => handleConfirm(reserve.reserveId)}
                    style={{ marginBottom: "5px" }}
                  >
                    예약 확정
                  </Button>
                )}
                {reserve.reserveStatus === 1 && (
                  <Button
                    variant="outline-warning"
                    onClick={() => handleComplete(reserve.reserveId)}
                    style={{ marginBottom: "5px" }}
                  >
                    완료
                  </Button>
                )}
                {(reserve.reserveStatus === 0 ||
                  reserve.reserveStatus === 1) && (
                  <Button
                    variant="outline-danger"
                    onClick={() => handleCancel(reserve.reserveId)}
                  >
                    예약 취소
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}
        />
      ) : (
        <p>예약이 없습니다.</p>
      )}
    </div>
  );
};

export default StoreReserve;
