import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const MyReserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || !userInfo.username) {
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchMyReservations = () => {
      instance
        .get("/reserve/my-reservations")
        .then((res) => {
          setReservations(res.data || []);
        })
        .catch((error) => {
          console.error("나의 예약 가져오기 실패:", error);
          Swal.fire("실패", "나의 예약을 가져오는 데 실패했습니다.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchMyReservations();
  }, []);

  const handleEditClick = (reservationId) => {
    navigate(`/reserve/edit/${reservationId}`);
  };

  const handleDeleteClick = (reservationId) => {
    Swal.fire({
      title: "예약 삭제",
      text: "정말로 이 예약을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .delete(`/reserve/delete/${reservationId}`)
          .then(() => {
            Swal.fire("삭제됨!", "예약이 삭제되었습니다.", "success");
            setReservations((prevReservations) =>
              prevReservations.filter((reserve) => reserve.id !== reservationId)
            );
          })
          .catch((error) => {
            console.error("예약 삭제 실패:", error);
            Swal.fire("삭제 실패", "예약 삭제에 실패했습니다.", "error");
          });
      }
    });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>나의 예약 페이지</h2>
      {reservations && reservations.length > 0 ? (
        <ul>
          {reservations.map((reserve) => (
            <li key={reserve.id}>
              <strong>가게 이름:</strong> {reserve.storeName} <br />
              <strong>예약 날짜:</strong> {reserve.date} <br />
              <strong>예약 시간:</strong> {reserve.time} <br />
              <button onClick={() => handleEditClick(reserve.id)}>수정</button>
              <button onClick={() => handleDeleteClick(reserve.id)}>
                삭제
              </button>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>작성된 예약이 없습니다.</p>
      )}
    </div>
  );
};

export default MyReserve;
