import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import instance from "./../../api/instance";
import { getUserInfo } from "./../../hooks/userSlice";
import { isNotLoginSwal } from "../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faComment,
  faUserSlash,
  faCircleUser, // 기본 아이콘 추가
} from "@fortawesome/free-solid-svg-icons";
import {
  faPenToSquare as faPenRegular,
  faComment as faCommentRegular,
} from "@fortawesome/free-regular-svg-icons"; // regular 아이콘 임포트

import { Link } from "react-router-dom";
import "./css/myPage.css";

const Mypage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [isAdmin, setIsAdmin] = useState(false);

  const [isHoveredPen, setIsHoveredPen] = useState(false);
  const [isHoveredComment, setIsHoveredComment] = useState(false);

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      isNotLoginSwal();
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  // 파일 업로드 성공 후 처리

  // 어드민 확인
  useEffect(() => {
    if (userInfo.id) {
      instance
        .get(`/user/isAdminByUserId?userId=${userInfo.id}`)
        .then((res) => {
          if (res.data === 3) {
            setIsAdmin(true);
          }
        });
    }
  }, [userInfo.id]);

  return (
    <div className="mypage-height-cover">
      {/* 프로필 이미지 부분 */}
      <div className="mypage-container">
        <div className="mypage-main-cover">
          <div className="mypage-chooseUser1">
            <div>
              <Link to="/user/CheckUserEdit" className="text-decoration-none">
                <button
                  className="mypage-button"
                  onMouseEnter={() => setIsHoveredPen(true)} // hover 시 상태 변경
                  onMouseLeave={() => setIsHoveredPen(false)} // hover 종료 시 상태 변경
                >
                  {" "}
                  <FontAwesomeIcon
                    className="mypage-icon"
                    icon={isHoveredPen ? faPenRegular : faPenToSquare}
                    size="7x"
                  />
                  <span className="mypage-text">회원 관리</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="mypage-chooseUser2">
            <div className="mypage-detail-cover">
              <Link to="/review/myreview" className="text-decoration-none">
                <button
                  className="mypage-button"
                  onMouseEnter={() => setIsHoveredComment(true)} // hover 시 상태 변경
                  onMouseLeave={() => setIsHoveredComment(false)}
                >
                  {" "}
                  <FontAwesomeIcon
                    className="mypage-icon"
                    icon={isHoveredComment ? faCommentRegular : faComment}
                    size="7x"
                  />
                  <span className="mypage-text">나의 리뷰</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
