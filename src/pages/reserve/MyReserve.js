import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const MyReserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo);

  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo.username) {
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchMyReserves = () => {
      instance
        .get("/reserve/my-reserves")
        .then((res) => {
          setReserves(res.data);
        })
        .catch((error) => {
          console.error("나의 예약 가져오기 실패:", error);
          Swal.fire("실패", "나의 예약을 가져오는 데 실패했습니다.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchMyReserves();
  }, []);

  const handleEditClick = (reserveId) => {
    navigate(`/reserve/edit/${reserveId}`);
  };

  const handleDeleteClick = (reserveId) => {
    Swal.fire({
      title: "예약 취소",
      text: "정말로 이 예약을 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "예약 취소",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .delete(`/reserve/delete/${reserveId}`)
          .then(() => {
            Swal.fire("예약 취소됨!", "예약이 취소되었습니다.", "success");
            setReserves((prevReserves) =>
              prevReserves.filter((reserve) => reserve.id !== reserveId)
            );
          })
          .catch((error) => {
            console.error("예약 삭제 실패:", error);
            Swal.fire("예약 취소 실패", "예약 취소에 실패했습니다.", "error");
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
      {reserves.length > 0 ? (
        <ul>
          {reserves.map((reserve) => (
            <li key={reserve.id}>
              <strong>가게 이름:</strong> {reserve.storeName} <br />
              <strong>예약 날짜:</strong> {reserve.date} <br />
              <strong>예약 시간:</strong> {reserve.time} <br />
              <button onClick={() => handleEditClick(reserve.id)}>수정</button>
              <button onClick={() => handleDeleteClick(reserve.id)}>
                예약 취소
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
