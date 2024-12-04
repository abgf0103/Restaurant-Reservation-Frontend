import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import instance from "./../../api/instance";
import { getUserInfo, setUserInfo } from "./../../hooks/userSlice";
import { isNotLoginSwal } from "../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faPenToSquare,
  faPen,
  faComment,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "./css/myPage.css";

const Mypage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch 사용
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHoveredPen, setIsHoveredPen] = useState(false);
  const [isHoveredComment, setIsHoveredComment] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      isNotLoginSwal();
      navigate("/user/login");
    } else {
      // 사용자 정보가 있으면 프로필 이미지 fileId로 상태 설정
      if (userInfo.fileId) {
        console.log(userInfo);
        setProfileImage(userInfo.fileId);
      }
    }
  }, [navigate, userInfo]);

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

  // 프로필 이미지 업로드 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // 선택된 파일 상태 업데이트
  };

  // 프로필 이미지 업로드 API 호출
  const handleProfileImageUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("fileTarget", "profileImage"); // 서버에 전달할 파일 종류 지정
      formData.append("files", selectedFile); // 선택된 파일을 FormData에 추가

      instance
        .post("/file/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("프로필 이미지 업로드 성공:", res.data);

          // 파일이 성공적으로 업로드 되면, 사용자 정보 다시 불러오기
          instance
            .get(`/user/me`)
            .then((response) => {
              console.log("사용자 정보 갱신:", response.data);
              // 사용자 정보 갱신 후 상태 업데이트
              setProfileImage(response.data.fileId); // 최신 fileId를 사용
              dispatch(setUserInfo(response.data)); // Redux 상태를 갱신
            })
            .catch((error) => {
              console.error("사용자 정보 갱신 실패:", error);
            });
        })
        .catch((err) => {
          console.error("프로필 이미지 업로드 실패:", err);
          Swal.fire({
            title: "업로드 실패",
            text: "프로필 이미지 업로드 중 오류가 발생했습니다.",
            icon: "error",
          });
        });
    }
  };

  return (
    <div className="mypage-height-cover">
      <div className="mypage-container">
        <div className="mypage-main-cover">
          {/* 프로필 이미지 부분 */}
          <div className="mypage-profile-image">
            {profileImage ? (
              <img
                src={`${process.env.REACT_APP_HOST}/file/viewId/${profileImage}`}
                alt="프로필 이미지"
                className="mypage-profile-img"
                width="160" // 이미지 크기 조정
                height="160"
              />
            ) : (
              <FontAwesomeIcon
                className="mypage-default-icon"
                icon={faCircleUser} // 기본 아이콘
                style={{ fontSize: "150px", width: "160px", height: "160px" }}
              />
            )}
          </div>

          {/* 프로필 이미지 업로드 버튼 */}
          <div className="mypage-upload-button">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
              id="profile-image-upload"
            />
            <label htmlFor="profile-image-upload">
              <Button
                variant="primary"
                type="button"
                onClick={() =>
                  document.getElementById("profile-image-upload").click()
                }
              >
                프로필 사진 선택
              </Button>
            </label>
            <Button
              variant="secondary"
              type="button"
              onClick={handleProfileImageUpload}
            >
              업로드
            </Button>
          </div>

          {/* 나머지 마이페이지 버튼들 */}
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
                    icon={isHoveredPen ? faPen : faPenToSquare} // 수정된 아이콘
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
                    icon={isHoveredComment ? faCommentDots : faComment} // 수정된 아이콘
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
