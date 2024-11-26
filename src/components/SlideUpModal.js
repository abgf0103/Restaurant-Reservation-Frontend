import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import DatePicker from "react-datepicker";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "../pages/reserve/css/Modal.css";
import instance from "../api/instance";
import { useNavigate } from "react-router-dom";

const SlideUpModal = ({ isOpen, onClose, selectedStoreId }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(isOpen);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [storeInfo, setStoreInfo] = useState(null);
  const userInfo = useSelector(getUserInfo);
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

      // 가게 정보 로드
      if (selectedStoreId) {
        instance
          .get(`/store/view/${selectedStoreId}`)
          .then((response) => {
            setStoreInfo(response.data);
            console.log("가게 정보:", response.data);
          })
          .catch((error) => {
            console.error("가게 정보 불러오기 오류:", error);
          });
      }
    } else {
      const modalBackground = document.querySelector(".modal-background");
      const slideUpPanel = document.querySelector(".slide-up");
      if (modalBackground && slideUpPanel) {
        modalBackground.classList.remove("active");
        slideUpPanel.classList.remove("active");
      }
      const animationDuration = 500;
      setTimeout(() => {
        setIsPanelVisible(false);
        document.body.style.overflow = "auto";
      }, animationDuration);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, selectedStoreId]);

  const [isDragging, setIsDragging] = useState(false);

  const handleBackgroundMouseDown = () => {
    setIsDragging(true);
  };

  const handleBackgroundMouseUp = (e) => {
    if (isDragging && e.target.className.includes("modal-background")) {
      onClose();
    }
    setIsDragging(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(
      `선택한 날짜: ${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`
    );
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    console.log(`오늘 날짜 선택: ${today}`);
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

    const [timeHour, timeMinute] = selectedTime.split(":");
    const reservationDateTime = new Date(selectedDate);
    reservationDateTime.setHours(parseInt(timeHour));
    reservationDateTime.setMinutes(parseInt(timeMinute));
    reservationDateTime.setSeconds(0);

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
      alert("예약이 취소되었습니다.");
    }
  };

  // 가게의 영업 시간을 바탕으로 시간 선택 슬라이드를 생성
  const renderTimeOptions = () => {
    if (!storeInfo || !storeInfo.storeHours) {
      return [];
    }

    try {
      const storeHours = storeInfo.storeHours.trim();

      // 정규식을 사용하여 영업 시간 추출
      const timeRangeMatch = storeHours.match(
        /(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/
      );
      if (!timeRangeMatch) {
        console.warn("영업시간 포맷이 올바르지 않습니다:", storeHours);
        return [];
      }

      const openTime = timeRangeMatch[1]; // 오픈 시간
      const closeTime = timeRangeMatch[2]; // 종료 시간

      const openHour = parseInt(openTime.split(":")[0], 10);
      const openMinute = parseInt(openTime.split(":")[1], 10);
      const closeHour = parseInt(closeTime.split(":")[0], 10);
      const closeMinute = parseInt(closeTime.split(":")[1], 10);

      const timeOptions = [];
      let currentHour = openHour;
      let currentMinute = openMinute;

      // 한 시간 간격으로 종료 시간 전까지 생성
      while (
        currentHour < closeHour ||
        (currentHour === closeHour && currentMinute < closeMinute)
      ) {
        timeOptions.push(
          `${String(currentHour).padStart(2, "0")}:${String(
            currentMinute
          ).padStart(2, "0")}`
        );
        currentHour += 1;
      }

      return timeOptions;
    } catch (error) {
      console.error("영업 시간 파싱 오류:", error);
      return [];
    }
  };

  return (
    <>
      {isPanelVisible && (
        <div
          className="modal-background"
          onMouseDown={handleBackgroundMouseDown}
          onMouseUp={handleBackgroundMouseUp}
        >
          <div className={`slide-up ${isOpen ? "active" : ""}`}>
            <div onClick={(e) => e.stopPropagation()}>
              {/* 달력 컴포넌트 */}
              <div className="calendar-container">
                <DatePicker
                  formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  minDate={new Date()}
                  filterDate={(date) =>
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear
                  }
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="datepicker-header">
                      <button
                        onClick={handleTodayClick}
                        className="today-button"
                      >
                        오늘
                      </button>
                      <button
                        onClick={() => {
                          decreaseMonth();
                          setCurrentMonth(date.getMonth() - 1);
                          setCurrentYear(date.getFullYear());
                        }}
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
                        onClick={() => {
                          increaseMonth();
                          setCurrentMonth(date.getMonth() + 1);
                          setCurrentYear(date.getFullYear());
                        }}
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
            <div className="people-selection-container">
              <Swiper
                spaceBetween={6}
                slidesPerView="auto"
                freeMode={true}
                scrollbar={{ draggable: true }}
                grabCursor={true}
                className="swiper-container"
                style={{ overflow: "visible" }}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <SwiperSlide
                    key={i}
                    className="swiper-slide"
                    // style={{ width: "auto", marginRight: "6px" }}
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
                grabCursor={true}
                className="swiper-container"
                style={{ overflow: "visible" }}
              >
                {renderTimeOptions().map((time, index) => (
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
                ))}
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
