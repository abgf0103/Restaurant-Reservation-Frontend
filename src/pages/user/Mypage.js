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
import FileUpload from "./fileupload"; // FileUpload 컴포넌트 import
import { Link } from "react-router-dom";
import "./css/myPage.css";

const Mypage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(""); // 프로필 이미지 URL 상태 추가

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
    <div>
      <h2>마이 페이지</h2>
      {/* 프로필 이미지 부분 */}
      <div className="mypage-container">
        {profileImageUrl ? (
          <img className="aaa" src={profileImageUrl} alt="프로필" />
        ) : (
          <FontAwesomeIcon
            className="default-icon"
            icon={faCircleUser}
            style={{ fontSize: "200px", width: "200px", height: "200px" }} // 크기 설정
          />
        )}
        {/* 파일 업로드 컴포넌트 */}
        <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
      </div>

      <div>
        <FontAwesomeIcon icon={faPenToSquare} />
        <Link to="/user/CheckUserEdit">회원수정 페이지</Link>
      </div>
      <div>
        <FontAwesomeIcon icon={faComment} />
        <Link to="/review/myreview">나의 리뷰 페이지</Link>
      </div>

      <p>
        <FontAwesomeIcon icon={faUserSlash} />
        <Link to="/user/deleteUser">회원 삭제</Link>
      </p>
      {/* 어드민만 보이는 페이지 */}
      {isAdmin && (
        <p>
          <Link to="/admin">어드민 페이지</Link>
        </p>
      )}
    </div>
  );
};

export default Mypage;
