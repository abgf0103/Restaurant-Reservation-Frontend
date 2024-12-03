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
import FileUpload from "./fileupload"; // FileUpload 컴포넌트 import
import { Link } from "react-router-dom";
import "./css/myPage.css";

const Mypage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(""); // 프로필 이미지 URL 상태 추가
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
  const handleFileUploadSuccess = (fileData) => {
    console.log("파일 업로드 성공:", fileData);
    // 파일 업로드 후 서버에서 반환된 이미지 URL을 사용자 프로필에 반영
    const uploadedFileUrl = `${process.env.REACT_APP_HOST}/file/view/${fileData[0].saveFileName}`;
    setProfileImageUrl(uploadedFileUrl); // 상태에 이미지 URL 저장
    // 사용자가 업로드한 이미지 URL을 서버에 반영 (필요하다면 사용자 프로필 업데이트 API 호출)
    instance
      .post("/user/updateProfileImage", { profileImage: uploadedFileUrl })
      .then((res) => {
        console.log("사용자 프로필 이미지 업데이트 성공");
      })
      .catch((err) => {
        console.error("사용자 프로필 이미지 업데이트 실패", err);
      });
  };

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

  useEffect(() => {
    // 로그인 후 프로필 이미지 URL을 받아와서 화면에 표시
    if (userInfo.profileImage) {
      setProfileImageUrl(
        `${process.env.REACT_APP_HOST}/user/profile/${userInfo.profileImage}`
      );
    }
  }, [userInfo]);

  return (
    <div className="mypage-height-cover">
      {/* 프로필 이미지 부분 */}
      <div className="mypage-container">
        {profileImageUrl ? (
          <img className="aaa" src={profileImageUrl} alt="프로필" />
        ) : (
          <FontAwesomeIcon
            className="mypage-default-icon"
            icon={faCircleUser}
            style={{ fontSize: "150px", width: "160px", height: "160px" }} // 크기 설정
          />
        )}
        {/* 파일 업로드 컴포넌트 */}
        <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />

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
                  <span className="mypage-text">회원 수정</span>
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

          <div className="mypage-chooseUser3">
            <div>
              <Link to="/user/deleteUser" className="text-decoration-none">
                <button className="mypage-button-delete">
                  {" "}
                  <FontAwesomeIcon
                    className="mypage-icon"
                    icon={faUserSlash}
                    size="7x"
                  />
                  <span className="mypage-text">회원 삭제</span>
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
