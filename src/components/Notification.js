import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import Swal from "sweetalert2";
import instance from "./../api/instance";
import { Dropdown, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Style.css";

const Notification = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo) || {}; // 기본값 설정
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo || !userInfo.username) {
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  // 사용자 알림 목록 가져오기
  const getUserNotifications = () => {
    instance
      .get(`/notifications/user`)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((error) => {
        console.error("알림 목록 가져오기 실패:", error);
        Swal.fire("실패", "알림 목록을 가져오는 데 실패했습니다.", "error");
      });
  };

  useEffect(() => {
    getUserNotifications();
  }, []);

  // 드롭다운 외부 클릭 감지하여 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.id !== "btn-all-delete"
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 알림 삭제
  const handleDeleteNotification = (notificationId) => {
    Swal.fire({
      title: "알림을 삭제하시겠습니까?",
      text: "삭제된 알림은 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .delete(`/notifications/delete/${notificationId}`)
          .then(() => {
            Swal.fire("성공", "알림이 삭제되었습니다.", "success");
            setNotifications((prevNotifications) =>
              prevNotifications.filter(
                (notification) => notification.notificationId !== notificationId
              )
            );
          })
          .catch((error) => {
            console.error("알림 삭제 실패:", error);
            Swal.fire("실패", "알림 삭제에 실패했습니다.", "error");
          });
      }
    });
  };

  // 모든 알림 삭제
  const handleDeleteAllNotifications = () => {
    const userId = userInfo.userId || userInfo.id;
    if (!userId) {
      console.error("User ID is undefined. Cannot proceed with deletion.");
      return;
    }

    Swal.fire({
      title: "모든 알림을 삭제하시겠습니까?",
      text: "삭제된 알림은 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .delete(`/notifications/user/delete/${userId}`)
          .then(() => {
            Swal.fire("성공", "모든 알림이 삭제되었습니다.", "success");
            setNotifications([]);
          })
          .catch((error) => {
            console.error("모든 알림 삭제 실패:", error);
            Swal.fire("실패", "모든 알림 삭제에 실패했습니다.", "error");
          });
      }
    });
  };

  // 드롭다운 내부 클릭 시 이벤트 전파 방지 (드롭다운 닫히는 것 방지)
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  const goToMyReserve = () => {
    navigate("/user/myreserve");
  };

  return (
    <div ref={dropdownRef}>
      <Dropdown
        show={isDropdownOpen}
        onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        id="notification-dropdown"
      >
        <Dropdown.Toggle id="notification-dropdown-toggle">
          🔔
          {notifications.length > 0 && (
            <Badge pill bg="danger">
              {notifications.length}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu id="notification-menu" onClick={handleDropdownClick}>
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <Dropdown.Item
                  key={notification.notificationId}
                  id="notification-item"
                  onDragStart={(e) => e.preventDefault()}
                  onClick={handleDropdownClick}
                >
                  <div className="notification-content">
                    <div>
                      <strong>{notification.message}</strong>
                      <br />
                      <small className="text-muted">
                        수신:{" "}
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <div className="btn-container">
                      <Button
                        id="btn-delete-notification"
                        size="sm"
                        onClick={() =>
                          handleDeleteNotification(notification.notificationId)
                        }
                      >
                        삭제
                      </Button>
                      <div onClick={goToMyReserve}>
                        <Button id="btn-my" variant="info" size="sm">
                          내 예약 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dropdown.Item>
              ))}
              <div className="delete-all-container">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAllNotifications();
                  }}
                  id="btn-all-delete"
                >
                  모든 알림 삭제
                </Button>
              </div>
            </>
          ) : (
            <Dropdown.Item disabled>알림이 없습니다.</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

// 외부에서 사용할 수 있도록 내보내기
export default Notification;
