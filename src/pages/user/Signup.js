//회원가입페이지

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MemberSignup = () => {
  const navigate = useNavigate();

  // 회원가입 상태 데이터
  const [formData, setFormData] = useState({
    id: 0,
    username: "",
    nikname: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    roleNum: "1",
    active: true,
    businessNum: "", // 사업자 등록 번호 추가 (예시)
  });

  const [errors, setErrors] = useState({});

  // 폼 입력값 변경 시 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 백엔드 API 호출
      const response = await axios.post(
        "http://localhost:8080/api/member/save",
        formData
      );

      if (response.data === true) {
        alert("회원가입이 완료되었습니다.");
        navigate("/user/login"); // 회원가입되면 로그인으로 이동
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">아이디:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="passwordConfirm">비밀번호 재입력:</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
          {errors.passwordConfirm && (
            <p style={{ color: "red" }}>{errors.passwordConfirm}</p>
          )}
        </div>

        <div>
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">전화번호:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">가입</button>
      </form>
    </>
  );
};

export default MemberSignup;
