import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const ReserveEdit = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo);

  const [reserve, setReservation] = useState({
    storeId: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || !userInfo.username) {
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchReservation = () => {
      instance
        .get(`/reserve/view/${reservationId}`)
        .then((res) => {
          setReservation(res.data || {});
        })
        .catch((error) => {
          console.error("예약 데이터 가져오기 실패:", error);
          Swal.fire("실패", "예약 데이터를 가져오는 데 실패했습니다.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchReservation();
  }, [reservationId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    instance
      .put(`/reserve/update/${reservationId}`, {
        ...reserve,
        userId: userInfo.userId,
        username: userInfo.username,
      })
      .then(() => {
        Swal.fire("성공", "예약이 수정되었습니다.", "success");
        navigate("/reserve/myreservation");
      })
      .catch((error) => {
        console.error("예약 수정 오류:", error);
        Swal.fire("실패", "예약 수정에 실패했습니다.", "error");
      });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>예약 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Store ID:</label>
          <input
            type="text"
            name="storeId"
            value={reserve.storeId}
            onChange={(e) =>
              setReservation({ ...reserve, storeId: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={reserve.date}
            onChange={(e) =>
              setReservation({ ...reserve, date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={reserve.time}
            onChange={(e) =>
              setReservation({ ...reserve, time: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">예약 수정</button>
      </form>
    </div>
  );
};

export default ReserveEdit;
