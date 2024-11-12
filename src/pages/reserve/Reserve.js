import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";
import "./../../css/SlideUpPanel.css";

const Reserve = ({ isPanelOpen, setIsPanelOpen, selectedStoreId }) => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reserve, setReserve] = useState({
    storeId: selectedStoreId || "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (selectedStoreId) {
      setReserve((prev) => ({ ...prev, storeId: selectedStoreId }));
    }
  }, [selectedStoreId]);

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
      .post(
        "/reserve/save",
        {
          ...reserve,
          userId: userInfo.userId,
          username: userInfo.username,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      .then(() => {
        Swal.fire("성공", "예약 되었습니다.", "success");
        setIsPanelOpen(false); // 예약 후 패널 닫기
        navigate("/reserve/myreserve");
      })
      .catch((error) => {
        console.error("예약 오류:", error);
        Swal.fire("실패", "예약 실패했습니다.", "error");
      });
  };

  return (
    <div className={`slide-up ${isPanelOpen ? "active" : ""}`}>
      <h1>예약하기</h1>
      <form onSubmit={handleSubmit}>
        {/* 추후 달력, 시간 삽입 */}
        <button type="submit">예약</button>
        <button type="button" onClick={() => setIsPanelOpen(false)}>
          닫기
        </button>
      </form>
    </div>
  );
};

export default Reserve;
