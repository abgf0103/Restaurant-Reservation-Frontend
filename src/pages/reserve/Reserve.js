import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";

const Reserve = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo);

  const [reserve, setReserve] = useState({
    storeId: "",
    date: "",
    time: "",
  });

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
        Swal.fire("성공", "예약이 저장되었습니다.", "success");
        navigate("/reserve/myreserve");
      })
      .catch((error) => {
        console.error("예약 저장 오류:", error);
        Swal.fire("실패", "예약 저장에 실패했습니다.", "error");
      });
  };

  return (
    <div>
      <h1>예약 작성</h1>
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
        <button type="submit">예약 작성</button>
      </form>
    </div>
  );
};

export default Reserve;
