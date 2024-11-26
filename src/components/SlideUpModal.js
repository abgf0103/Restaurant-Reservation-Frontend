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
import Swal from "sweetalert2";

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
  const [mousedownOnBackground, setMousedownOnBackground] = useState(false);

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

  // 마우스를 누를 때 백그라운드에서 시작했는지 확인
  const handleMouseDown = (e) => {
    if (e.target.classList.contains("modal-background")) {
      setMousedownOnBackground(true);
    } else {
      setMousedownOnBackground(false);
    }
  };

  // 마우스를 떼었을 때 백그라운드에서 시작하고 백그라운드에서 끝났는지 확인
  const handleMouseUp = (e) => {
    if (
      mousedownOnBackground &&
      e.target.classList.contains("modal-background")
    ) {
      onClose();
    }
    setMousedownOnBackground(false);
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
      Swal.fire(
        "오류",
        "가게 정보 오류입니다. 관리자에게 문의해주세요.",
        "error"
      );
      return;
    }

    if (!selectedPeople && !selectedTime) {
      Swal.fire("오류", "인원수와 시간을 선택해주세요.", "error");
      return;
    }
    if (!selectedPeople) {
      Swal.fire("오류", "인원수를 선택해주세요.", "error");
      return;
    }
    if (!selectedTime) {
      Swal.fire("오류", "시간을 선택해주세요.", "error");
      return;
    }

    const [timeHour, timeMinute] = selectedTime.split(":");
    const reservationDateTime = new Date(selectedDate);
    reservationDateTime.setHours(parseInt(timeHour));
    reservationDateTime.setMinutes(parseInt(timeMinute));
    reservationDateTime.setSeconds(0);

    const today = new Date();
    const diffTime = reservationDateTime.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      const result = await Swal.fire({
        title: "예약 취소 불가",
        text: "오늘 날짜와 예약 날짜의 차이가 3일 이하면 예약 취소가 불가능합니다. 그래도 예약 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      });
      if (!result.isConfirmed) {
        Swal.fire("취소", "예약이 취소되었습니다.", "info");
        return;
      }
    }

    const formattedDateTime = `${reservationDateTime.getFullYear()}-${String(
      reservationDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(reservationDateTime.getDate()).padStart(
      2,
      "0"
    )}T${String(reservationDateTime.getHours()).padStart(2, "0")}:${String(
      reservationDateTime.getMinutes()
    ).padStart(2, "0")}:00`;

    const confirmationMessage = `예약 내용을 확인해주세요:<br>날짜: ${selectedDate.getFullYear()}년 ${
      selectedDate.getMonth() + 1
    }월 ${selectedDate.getDate()}일<br>시간: ${selectedTime}<br>인원수: ${selectedPeople}명<br><br>예약하시겠습니까?`;

    Swal.fire({
      title: "예약 확인",
      html: confirmationMessage,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        const reservationData = {
          storeId: selectedStoreId,
          reserveDate: formattedDateTime,
          partySize: selectedPeople,
        };
        console.log("예약 정보 : ", reservationData);

        try {
          instance.post("reservations/save", reservationData).then((res) => {
            console.log(res);
            Swal.fire({
              title: "예약 완료",
              text: "예약이 완료되었습니다. 내 예약 창으로 이동하시겠습니까?",
              icon: "success",
              showCancelButton: true,
              confirmButtonText: "이동",
              cancelButtonText: "아니오",
            }).then((moveResult) => {
              if (moveResult.isConfirmed) {
                navigate("/user/myreserve");
              }
            });
          });
        } catch (error) {
          console.error("예약 전송 오류:", error);
          Swal.fire(
            "오류",
            "예약 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
            "error"
          );
        }
      } else {
        Swal.fire("취소", "예약이 취소되었습니다.", "info");
      }
    });
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
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className={`slide-up ${isOpen ? "active" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* 달력 컴포넌트 */}
              <div
                className="calendar-container"
                onMouseDown={(e) => e.preventDefault()}
              >
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
                  <SwiperSlide key={i} className="swiper-slide">
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
