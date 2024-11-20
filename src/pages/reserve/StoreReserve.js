import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const ReserveList = () => {
  const { storeId } = useParams(); // URL에서 storeId 추출
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo || !userInfo.username) {
      navigate("/user/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    }
  }, [navigate, userInfo]);

  // 특정 가게의 예약 목록 가져오기
  useEffect(() => {
    if (storeId) {
      instance
        .get(`/api/reservations/store/${storeId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })
        .then((res) => {
          setReserves(res.data || []); // 가져온 데이터를 상태로 설정
        })
        .catch((error) => {
          console.error("예약 목록 가져오기 실패:", error);
          Swal.fire("실패", "예약 목록을 가져오는 데 실패했습니다.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [storeId, userInfo]);

  // 예약 상태 변경 처리 함수
  const handleStatusChange = (reserveId, newStatus) => {
    instance
      .put(
        `/api/reservations/update-status/${reserveId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire("성공", "예약 상태가 업데이트되었습니다.", "success");
        // 상태 업데이트 후 다시 예약 목록을 가져오도록 처리
        setReserves((prevReserves) =>
          prevReserves.map((reserve) =>
            reserve.reserveId === reserveId
              ? { ...reserve, status: newStatus }
              : reserve
          )
        );
      })
      .catch((error) => {
        console.error("예약 상태 업데이트 실패:", error);
        Swal.fire("실패", "예약 상태를 업데이트하는 데 실패했습니다.", "error");
      });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>예약 목록</h1>
      {reserves && reserves.length > 0 ? (
        <ul>
          {reserves.map((reserve) => (
            <li key={reserve.reserveId}>
              <strong>가게 이름:</strong> {reserve.storeName} <br />
              <strong>예약 날짜:</strong>{" "}
              {new Date(reserve.reserveDate).toLocaleString()} <br />
              <strong>인원 수:</strong> {reserve.partySize}명 <br />
              <strong>업데이트 날짜:</strong> {reserve.updatedAt}명 <br />
              <strong>예약 상태:</strong>{" "}
              <select
                value={reserve.status}
                onChange={(e) =>
                  handleStatusChange(reserve.reserveId, e.target.value)
                }
              >
                <option value="0">예약 대기</option>
                <option value="1">예약 확정</option>
                <option value="2">예약 완료</option>
                <option value="3">예약 취소</option>
              </select>
              <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>예약이 없습니다.</p>
      )}
    </div>
  );
};

export default ReserveList;
