import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap"; // Bootstrap 컴포넌트 임포트
import "./css/businessSignup.css";

const BusinessSignup = () => {
  const navigate = useNavigate();

  // 회원가입 상태 데이터
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    phone: "",
    roleNum: "",
    businessNum: "", // 사업자 등록 번호
    id: 0,
    active: true,
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
    if (value.replace(/\D/g, "").length > 11) {
      return; // 11자리가 넘으면 입력을 막음
    }

    setFormData({
      ...formData,
      phone: value,
    });
  };

  // 사업자 등록번호 자동 하이픈 추가
  const formatBusinessNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // 숫자만 남기기
    const limited = cleaned.slice(0, 10); // 숫자만 10자리 제한
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 5) {
      return limited.replace(/(\d{3})(\d{0,2})/, "$1-$2");
    } else {
      return limited.replace(/(\d{3})(\d{2})(\d{0,5})/, "$1-$2-$3");
    }
  };

  const handleBusinessNumberChange = (e) => {
    const value = formatBusinessNumber(e.target.value);
    setFormData({
      ...formData,
      businessNum: value,
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
    const namePattern = /^[a-zA-Z가-힣0-9]{1,10}$/;
    if (!namePattern.test(formData.name)) {
      validationErrors.name = "이름은 한글로 2자 이상 입력해야 합니다.";
    }

    // 전화번호 유효성 검사 (11자리, 숫자만)
    const phonePattern = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phonePattern.test(formData.phone)) {
      validationErrors.phone = "전화번호는 11자리, '-' 포함해야 합니다.";
    }

    // 사업자등록번호 유효성 검사 (000-00-00000 형식)
    const businessNumPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!businessNumPattern.test(formData.businessNum)) {
      validationErrors.businessNum =
        "사업자 등록번호는 000-00-00000 형식으로 입력해야 합니다.";
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
      <div className="businessSignup-width-cover">
        <Form onSubmit={handleSubmit} className="businessSignup-main-cover">
          <h2>사업자 회원가입</h2>
          <hr />
          <Form.Group controlId="username">
            <Form.Label className="business-text">아이디</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력해주세요"
              className="business-input"
              required
            />
            {errors.username && (
              <Form.Text style={{ color: "red" }}>{errors.username}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label className="business-text">비밀번호</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              className="business-input"
              required
            />
            {errors.password && (
              <Form.Text style={{ color: "red" }}>{errors.password}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="passwordConfirm">
            <Form.Label className="business-text">비밀번호 재입력</Form.Label>
            <Form.Control
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              className="business-input"
              required
            />
            {errors.passwordConfirm && (
              <Form.Text style={{ color: "red" }}>
                {errors.passwordConfirm}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="name">
            <Form.Label className="business-text">이름</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="성함을 입력해주세요"
              className="business-input"
              required
            />
            {errors.name && (
              <Form.Text style={{ color: "red" }}>{errors.name}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label className="business-text">이메일</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
              className="business-input"
              required
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label className="business-text">전화번호</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="전화번호를 입력해주세요"
              className="business-input"
              required
            />
            {errors.phone && (
              <Form.Text style={{ color: "red" }}>{errors.phone}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="businessNum">
            <Form.Label className="business-text">사업자등록번호</Form.Label>
            <Form.Control
              type="text"
              name="businessNum"
              value={formData.businessNum}
              onChange={handleBusinessNumberChange}
              placeholder="사업자 번호를 입력해주세요"
              className="business-input"
              required
            />
            {errors.businessNum && (
              <Form.Text style={{ color: "red" }}>
                {errors.businessNum}
              </Form.Text>
            )}
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="business-btn"
          >
            {loading ? "로딩 중..." : "가입"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default BusinessSignup;
