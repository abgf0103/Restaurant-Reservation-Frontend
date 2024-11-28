import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MemberSignup = () => {
  const navigate = useNavigate();

  // 회원가입 상태 데이터
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 폼 입력값 변경 시 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 전화번호 자동 하이픈 추가
  const formatPhoneNumber = (value) => {
    // 전화번호에 하이픈 추가
    const cleaned = value.replace(/\D/g, ""); // 숫자만 남기기
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return cleaned.replace(/(\d{3})(\d{0,4})/, "$1-$2");
    } else {
      return cleaned.replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1-$2-$3");
    }
  };

  const handlePhoneChange = (e) => {
    const value = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      phone: value,
    });
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    const validationErrors = {};

    // 아이디 유효성 검사 (4~15자, 영문 + 숫자)
    const usernamePattern = /^[a-zA-Z0-9]{4,15}$/;
    if (!usernamePattern.test(formData.username)) {
      validationErrors.username =
        "아이디는 4~15자, 영어와 숫자만 사용 가능합니다.";
    }

    // 비밀번호 유효성 검사 (8~15자, 영문 + 숫자 + 특수문자)
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;
    if (!passwordPattern.test(formData.password)) {
      validationErrors.password =
        "비밀번호는 8~15자, 영문 + 숫자 + 특수문자를 포함해야 합니다.";
    }

    // 비밀번호 재입력 검사
    if (formData.password !== formData.passwordConfirm) {
      validationErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 유효성 검사 (한글 2자 이상)
    const namePattern = /^[가-힣]{2,}$/;
    if (!namePattern.test(formData.name)) {
      validationErrors.name = "이름은 한글로 2자 이상 입력해야 합니다.";
    }

    // 전화번호 유효성 검사 (11자리, 숫자만)
    const phonePattern = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phonePattern.test(formData.phone)) {
      validationErrors.phone = "전화번호를 잘못 입력했습니다";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 유효성 검사를 통과하면 회원가입 요청
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/member/save",
        formData
      );

      if (response.data === true) {
        alert("회원가입이 완료되었습니다.");
        navigate("/user/login"); // 회원가입되면 로그인 페이지로 이동
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
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
            onChange={handlePhoneChange} // 전화번호 입력 시 하이픈 자동 추가
            required
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "로딩 중..." : "가입"}
        </button>
      </form>
    </>
  );
};

export default MemberSignup;
