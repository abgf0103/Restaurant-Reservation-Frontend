//회원 탈퇴 페이지

import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUserInfo } from "../../hooks/userSlice"; // 사용자 정보 초기화 액션
import instance from "../../api/instance";
import { removeTokenInfo } from "../../hooks/tokenSlice";

const DeleteUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 회원 탈퇴 요청 함수
  const handleDeleteAccount = () => {
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

    // axios
    //   .delete(`${process.env.REACT_APP_HOST}/user/delete`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`, // 인증 헤더 설정
    //     },
    //   })
    //   .then((res) => {
    //     Swal.fire({
    //       title: "회원 탈퇴 완료",
    //       text: "회원 탈퇴가 완료되었습니다.",
    //       icon: "success",
    //     });

    //     // 사용자 정보 삭제
    //     dispatch(removeUserInfo());
    //     localStorage.removeItem("userInfo"); // 로컬스토리지에 저장된 사용자 정보 삭제
    //     localStorage.removeItem("accessToken"); // 토큰 삭제

    //     // 메인 페이지로 이동
    //     navigate("/");
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     Swal.fire({
    //       title: "탈퇴 오류",
    //       text: "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.",
    //       icon: "error",
    //     });
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  return (
    <div className="container">
      <h3>회원 탈퇴</h3>
      <p>회원 탈퇴를 진행하시겠습니까?</p>
      <button
        className="btn btn-danger"
        onClick={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? "탈퇴 중..." : "회원 탈퇴"}
      </button>
    </div>
  );
};

export default DeleteUser;
