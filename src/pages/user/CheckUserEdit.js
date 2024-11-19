//회원수정 하기 전에 비밀번호 재확인 페이지

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import instance from "../../api/instance";

const CheckUserEdit = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호가 기존 비밀번호와 일치하는지 확인
    try {
      const response = await instance.post("/member/user/checkUserEdit", {
        id: userInfo.id,
        password: password,
      });

      if (response.data.success) {
        // 비밀번호가 일치하면 수정 페이지로 이동
        navigate("/user/edit");
      } else {
        setError("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      setError("비밀번호 확인에 실패했습니다.");
      Swal.fire({
        title: "실패",
        text: "비밀번호 확인에 실패했습니다.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container">
      <h2>비밀번호 확인</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">
          확인
        </button>
      </form>
    </div>
  );
};

export default CheckUserEdit;
