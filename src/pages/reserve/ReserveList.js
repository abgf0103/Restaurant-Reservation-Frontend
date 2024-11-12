import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const ReserveList = () => {
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

  // 예약 목록 가져오기
  useEffect(() => {
    instance
      .get("/reserve/list", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((res) => {
        setReserves(res.data.data || []);
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
      {reserves && reserves.length > 0 ? (
        <ul>
          {reserves.map((reserve) => (
            <li key={reserve.id}>
              <strong>가게 이름:</strong> {reserve.storeName} <br />
              <strong>예약 날짜:</strong> {reserve.date} <br />
              <strong>예약 시간:</strong> {reserve.time} <br />
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
