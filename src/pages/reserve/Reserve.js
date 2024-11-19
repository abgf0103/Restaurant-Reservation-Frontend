import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "../../api/instance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../../css/Style.css";

const Reserve = ({ isPanelOpen, setIsPanelOpen, selectedStoreId }) => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

  const [reserve, setReserve] = useState({
    storeId: selectedStoreId || "",
    date: new Date(), // 초기 날짜 설정
    time: "",
  });

  useEffect(() => {
    if (selectedStoreId) {
      setReserve((prev) => ({ ...prev, storeId: selectedStoreId }));
    }
  }, [selectedStoreId]);

  const handleDateChange = (date) => {
    const formattedDate = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    console.log("선택된 날짜:", formattedDate); // 콘솔에 선택한 날짜 출력
    setReserve((prevState) => ({
      ...prevState,
      date: date, // 선택한 날짜를 상태에 저장
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
      <form onSubmit={handleSubmit}>
        <DatePicker
          formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
          selected={reserve.date}
          onChange={(date) => handleDateChange(date)}
          minDate={new Date()} // 오늘 이후의 날짜만 선택 가능
          dayClassName={(date) =>
            date < new Date() ? "datepicker-day--disabled" : undefined
          }
          inline
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="datepicker-header">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="datepicker-nav-button"
              >
                {"<"}
              </button>
              <span className="datepicker-title">
                {date.getFullYear()}년{" "}
                {date.toLocaleString("ko-KR", { month: "long" })}
              </span>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="datepicker-nav-button"
              >
                {">"}
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
};

export default Reserve;
