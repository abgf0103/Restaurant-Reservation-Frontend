import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";
import { Button, Card, Form } from "react-bootstrap";
import { reserveStatus } from "./../../utils/tools";
import "./css/Reserve.css";

const StoreReserve = () => {
  const { storeId } = useParams(); // URL에서 storeId 추출
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [reserves, setReserves] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [filterStatus, setFilterStatus] = useState("all"); // 필터 상태 추가
  const [filteredReservations, setFilteredReservations] = useState([]); // 필터링된 예약 목록 추가

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
        setReserves(res.data);
        setFilteredReservations(res.data); // 초기 예약 목록으로 필터링된 예약 목록 설정
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
  const handleStatusChange = (reserveId, newStatus, successMessage) => {
    instance
      .put(`/reservations/update-status/${reserveId}`, { status: newStatus })
      .then(() => {
        Swal.fire("성공", successMessage, "success");
        setReserves((prevReserves) =>
          prevReserves.map((reserve) =>
            reserve.reserveId === reserveId
              ? { ...reserve, reserveStatus: newStatus }
              : reserve
          )
        );
        setFilteredReservations((prevReserves) =>
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

  // 예약 상태 필터링 함수 추가
  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if (status === "all") {
      setFilteredReservations(reserves);
    } else {
      setFilteredReservations(
        reserves.filter((reserve) => parseInt(status) === reserve.reserveStatus)
      );
    }
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
        handleStatusChange(reserveId, 1, "예약이 확정되었습니다.");
      }
    });
  };

  // 예약 취소 함수
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
        handleStatusChange(reserveId, 3, "예약이 취소되었습니다.");
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
        handleStatusChange(reserveId, 2, "예약이 완료되었습니다.");
      }
    });
  };

  // 페이지네이션 관련 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="reserve-container">
      <div className="reserve-header">
        <h2>
          <br />
          {storeName}
        </h2>
        <Form.Group controlId="filterStatus" className="filter-status">
          <Form.Label id="form-label">예약 상태 선택 : </Form.Label>
          <Form.Control
            as="select"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="all">전체</option>
            <option value="0">대기 중인 예약</option>
            <option value="1">확정된 예약</option>
            <option value="2">완료된 예약</option>
            <option value="3">취소된 예약</option>
          </Form.Control>
        </Form.Group>
      </div>
      {filteredReservations.length > 0 ? (
        <>
          <ul className="reserve-card-wrapper">
            {currentItems.map((reserve) => (
              <li key={reserve.reserveId} className="reserve-card">
                <Card className="reserve-card-item">
                  <Card.Body className="reserve-card-body">
                    <Card.Title>예약 ID: {reserve.reserveId}</Card.Title>
                    <Card.Text>
                      <strong>예약자 이름:</strong> {userInfo.username}
                      <br />
                      <strong>예약 날짜:</strong>{" "}
                      {new Date(reserve.reserveDate).toLocaleString()} <br />
                      <strong>인원 수:</strong> {reserve.partySize}명 <br />
                      <strong>예약 상태:</strong>{" "}
                      {reserveStatus(reserve.reserveStatus)} <br />
                      <strong>예약 신청 시간:</strong>{" "}
                      {new Date(reserve.createdAt).toLocaleString()}
                    </Card.Text>
                    <div className="btn-container">
                      {reserve.reserveStatus === 0 && (
                        <Button
                          variant="primary"
                          onClick={() => handleConfirm(reserve.reserveId)}
                        >
                          예약 확정
                        </Button>
                      )}
                      {reserve.reserveStatus === 1 && (
                        <Button
                          id="commit"
                          onClick={() => handleComplete(reserve.reserveId)}
                        >
                          예약 완료
                        </Button>
                      )}
                      {(reserve.reserveStatus === 0 ||
                        reserve.reserveStatus === 1) && (
                        <Button
                          variant="danger"
                          onClick={() => handleCancel(reserve.reserveId)}
                        >
                          예약 취소
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>예약이 없습니다.</p>
      )}
    </div>
  );
};

export default StoreReserve;
