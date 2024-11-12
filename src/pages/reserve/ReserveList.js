import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const ReserveList = () => {
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
    instance
      .get("/reserve/list")
      .then((res) => {
        setReservations(res.data.data || []);
      })
      .catch((error) => {
        console.error("예약 목록 가져오기 실패:", error);
        Swal.fire("실패", "예약 목록을 가져오는 데 실패했습니다.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>예약 목록</h1>
      {reservations && reservations.length > 0 ? (
        <ul>
          {reservations.map((reserve) => (
            <li key={reserve.id}>
              <strong>가게 이름:</strong> {reserve.storeName} <br />
              <strong>예약 날짜:</strong> {reserve.date} <br />
              <strong>예약 시간:</strong> {reserve.time} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>작성된 예약이 없습니다.</p>
      )}
    </div>
  );
};

export default ReserveList;
