import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import DatePicker from "react-datepicker";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "../pages/reserve/css/reserve.css";
import instance from "../api/instance";
import { useNavigate } from "react-router-dom";

const SlideUpModal = ({ isOpen, onClose, selectedStoreId }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(isOpen);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsPanelVisible(true);
      setTimeout(() => {
        document.body.style.overflow = "hidden";
        const modalBackground = document.querySelector(".modal-background");
        const slideUpPanel = document.querySelector(".slide-up");
        if (modalBackground && slideUpPanel) {
          modalBackground.classList.add("active");
          slideUpPanel.classList.add("active");
        }
      }, 100);
    } else {
      const modalBackground = document.querySelector(".modal-background");
      const slideUpPanel = document.querySelector(".slide-up");
      if (modalBackground && slideUpPanel) {
        modalBackground.classList.remove("active");
        slideUpPanel.classList.remove("active");
      }
      // 애니메이션이 끝나고 스크롤을 활성화
      const animationDuration = 500;
      setTimeout(() => {
        setIsPanelVisible(false);
        document.body.style.overflow = "auto";
      }, animationDuration);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleBackgroundClick = (e) => {
    if (e.target.className.includes("modal-background")) {
      onClose();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(
      `선택한 날짜: ${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`
    );
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    console.log(`선택한 시간: ${time}`);
  };

  const handlePeopleChange = (people) => {
    setSelectedPeople(people);
    console.log(`선택한 인원수: ${people}`);
  };

  const handleReservation = async () => {
    if (!selectedStoreId) {
      alert("가게 정보 오류입니다. 관리자에게 문의해주세요.");
      return;
    }

    if (!selectedPeople && !selectedTime) {
      alert("인원수와 시간을 선택해주세요.");
      return;
    }
    if (!selectedPeople) {
      alert("인원수를 선택해주세요.");
      return;
    }
    if (!selectedTime) {
      alert("시간을 선택해주세요.");
      return;
    }

    // 사용자가 선택한 날짜와 시간 정보를 결합하여 예약 DateTime 생성
    const [timeHour, timeMinute] = selectedTime.split(":");

    // 기존의 selectedDate를 복사하여 새로운 객체 생성
    const reservationDateTime = new Date(selectedDate);
    reservationDateTime.setHours(parseInt(timeHour));
    reservationDateTime.setMinutes(parseInt(timeMinute));
    reservationDateTime.setSeconds(0); // 초는 0으로 설정

    // 로컬 시간대 형식으로 reserveDate를 생성
    const formattedDateTime = `${reservationDateTime.getFullYear()}-${String(
      reservationDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(reservationDateTime.getDate()).padStart(
      2,
      "0"
    )}T${String(reservationDateTime.getHours()).padStart(2, "0")}:${String(
      reservationDateTime.getMinutes()
    ).padStart(2, "0")}:00`;

    const confirmationMessage = `예약 내용을 확인해주세요:\n날짜: ${selectedDate.getFullYear()}년 ${
      selectedDate.getMonth() + 1
    }월 ${selectedDate.getDate()}일\n시간: ${selectedTime}\n인원수: ${selectedPeople}명\n\n확인하시겠습니까?`;

    if (window.confirm(confirmationMessage)) {
      // 사용자가 확인을 눌렀을 때 예약 요청을 전송합니다.
      const reservationData = {
        storeId: selectedStoreId,
        reserveDate: formattedDateTime,
        partySize: selectedPeople,
      };
      console.log("예약 정보 : ", reservationData);

      try {
        instance.post("reservations/save", reservationData).then((res) => {
          console.log(res);
          navigate("/user/myreserve");
        });
      } catch (error) {
        console.error("예약 전송 오류:", error);
        alert("예약 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      // 사용자가 취소를 눌렀을 때
      alert("예약이 취소되었습니다.");
    }
  };

  return (
    <>
      {isPanelVisible && (
        <div className="modal-background" onClick={handleBackgroundClick}>
          <div className={`slide-up ${isOpen ? "active" : ""}`}>
            <div onClick={(e) => e.stopPropagation()}>
              {/* 달력 컴포넌트 */}
              <div className="calendar-container">
                <DatePicker
                  formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  minDate={new Date()} // 오늘 이전 날짜는 비활성화
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
              </div>
            </div>

            {/* 인원 선택 가로 드래그 요소 (Swiper 사용) */}
            <div className="option-personnel">
              <Swiper
                spaceBetween={6}
                slidesPerView="auto"
                freeMode={true}
                className="swiper-container"
                style={{ overflow: "visible" }}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <SwiperSlide
                    key={i}
                    className="swiper-slide"
                    style={{ width: "auto", marginRight: "6px" }}
                  >
                    <label className="people-label">
                      <input
                        type="radio"
                        name="count"
                        value={i + 1}
                        style={{ backgroundColor: "unset" }}
                        onChange={() => handlePeopleChange(i + 1)}
                      />
                      <span>{`${i + 1}명`}</span>
                    </label>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 시간 선택 가로 드래그 요소 (Swiper 사용) */}
            <div className="time-selection-container">
              <Swiper
                spaceBetween={6}
                slidesPerView="auto"
                freeMode={true}
                className="swiper-container"
                style={{ overflow: "visible" }}
              >
                {["10:00", "11:00", "13:00", "15:00", "17:00"].map(
                  (time, index) => (
                    <SwiperSlide
                      key={index}
                      className="swiper-slide"
                      style={{ width: "auto", marginRight: "6px" }}
                    >
                      <label className="time-label">
                        <input
                          type="radio"
                          name="time"
                          value={time}
                          style={{ backgroundColor: "unset" }}
                          onChange={() => handleTimeChange(time)}
                        />
                        <span>{time}</span>
                      </label>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </div>

            {/* 예약하기 버튼 */}
            <div className="reserve-button-container">
              <button className="reserve-button" onClick={handleReservation}>
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlideUpModal;
