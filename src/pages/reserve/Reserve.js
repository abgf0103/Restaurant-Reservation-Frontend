import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const Reserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reserve, setReserve] = useState({
    storeId: "",
    date: "",
    time: "",
  });

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo || !userInfo.username) {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserve((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    instance
      .post("/reserve/save", {
        ...reserve,
        userId: userInfo.userId,
        username: userInfo.username,
      })
      .then(() => {
        Swal.fire("성공", "예약 되었습니다.", "success");
        navigate("/reserve/myreserve");
      })
      .catch((error) => {
        console.error("예약 오류:", error);
        Swal.fire("실패", "예약 실패했습니다.", "error");
      });
  };

  return (
    <div>
      <h1>예약하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Store ID:</label>
          <input
            type="text"
            name="storeId"
            value={reserve.storeId}
            onChange={handleChange}
            placeholder="가게 ID를 입력하세요."
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={reserve.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={reserve.time}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">예약</button>
      </form>
    </div>
  );
};

export default Reserve;
