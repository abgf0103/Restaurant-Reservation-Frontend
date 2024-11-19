// src/components/SlideUpModal.js
import React, { useEffect, useState } from "react";
import "../css/SlideUpPanel.css";

const SlideUpModal = ({ isOpen, onClose, children }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때
      setIsPanelVisible(true);
      setTimeout(() => {
        document.body.style.overflow = "hidden"; // 스크롤 비활성화
        const modalBackground = document.querySelector(".modal-background");
        const slideUpPanel = document.querySelector(".slide-up");
        if (modalBackground && slideUpPanel) {
          modalBackground.classList.add("active");
          slideUpPanel.classList.add("active");
        }
      }, 100); // 약간의 딜레이 후 애니메이션 클래스 추가
    } else {
      // 모달이 닫힐 때
      const modalBackground = document.querySelector(".modal-background");
      const slideUpPanel = document.querySelector(".slide-up");
      if (modalBackground && slideUpPanel) {
        modalBackground.classList.remove("active");
        slideUpPanel.classList.remove("active");
      }
      setTimeout(() => {
        setIsPanelVisible(false);
        document.body.style.overflow = "auto"; // 스크롤 다시 활성화
      }, 500); // 애니메이션 시간 후에 스크롤 다시 활성화
    }
  }, [isOpen]);

  const handleBackgroundClick = (e) => {
    if (e.target.className.includes("modal-background")) {
      onClose();
    }
  };

  return (
    <>
      {isPanelVisible && (
        <div className="modal-background" onClick={handleBackgroundClick}>
          <div className={`slide-up ${isOpen ? "active" : ""}`}>
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlideUpModal;
