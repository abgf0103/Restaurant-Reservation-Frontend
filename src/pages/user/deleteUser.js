import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUserInfo } from "../../hooks/userSlice"; // 사용자 정보 초기화 액션
import instance from "../../api/instance";
import { removeTokenInfo } from "../../hooks/tokenSlice";
import "./css/deleteUser.css";

const DeleteUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 회원 탈퇴 요청 함수
  const handleDeleteAccount = () => {
    Swal.fire({
      title: "정말로 회원 탈퇴를 하시겠습니까?",
      text: "회원 탈퇴는 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);

        // 사용자 인증 토큰이 필요하다면 Authorization 헤더에 추가
        const token = localStorage.getItem("accessToken"); // 토큰 가져오기

        instance
          .delete("/member/user/deleteUser")
          .then((res) => {
            Swal.fire({
              title: "회원 탈퇴 완료",
              text: "회원 탈퇴가 완료되었습니다.",
              icon: "success",
            });
            // 사용자 정보 삭제
            dispatch(removeUserInfo());
            dispatch(removeTokenInfo());

            // 메인 페이지로 이동
            navigate("/");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              title: "탈퇴 오류",
              text: "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <div className="deleteUser-container">
      <div className="deleteUser-cover">
        <div className="deleteUser-text">
          <h3>계정 삭제</h3>
        </div>
        <hr />
        <p>계정 삭제를 진행하시겠습니까?</p>
        <button
          className="deleteUser-btn btn-danger"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "탈퇴 중..." : "회원 탈퇴"}
        </button>
      </div>
    </div>
  );
};

export default DeleteUser;
