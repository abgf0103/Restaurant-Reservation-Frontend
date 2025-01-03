import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap"; // react-bootstrap에서 필요한 컴포넌트 임포트
import { formatPhoneNumber } from "../../utils/tools";
import "./css/businessSignup.css";
import BusinessSignup from "./BusinessSignup";

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
    roleNum: "",
    BusinessNum: 0,
    active: true,
    id: 0,
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

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    const usernamePattern = /^[a-zA-Z0-9]{4,15}$/;
    if (!usernamePattern.test(formData.username)) {
      validationErrors.username =
        "아이디는 4~15자, 영어와 숫자만 사용 가능합니다.";
    }

    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;
    if (!passwordPattern.test(formData.password)) {
      validationErrors.password =
        "비밀번호는 8~15자, 영문 + 숫자 + 특수문자를 포함해야 합니다.";
    }

    if (formData.password !== formData.passwordConfirm) {
      validationErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    const namePattern = /^[a-zA-Z가-힣0-9]{1,10}$/;
    if (!namePattern.test(formData.name)) {
      validationErrors.name = "이름은 한글로 2자 이상 입력해야 합니다.";
    }

    const phonePattern = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phonePattern.test(formData.phone)) {
      validationErrors.phone = "전화번호를 잘못 입력했습니다";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/member/save",
        formData
      );

      if (response.data === true) {
        alert("회원가입이 완료되었습니다.");
        navigate("/user/login");
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
    <div className="businessSignup-width-cover">
      <Form onSubmit={handleSubmit} className="businessSignup-main-cover">
        <h2>회원가입</h2>
        <hr />
        <Form.Group controlId="username">
          <Form.Label className="business-text">아이디</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
            placeholder="아이디를 입력해주세요"
            className="business-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="business-text">비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            placeholder="비밀번호를 입력해주세요"
            className="business-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="passwordConfirm">
          <Form.Label className="business-text">비밀번호 재입력</Form.Label>
          <Form.Control
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            isInvalid={!!errors.passwordConfirm}
            placeholder="비밀번호를 다시 입력해주세요"
            className="business-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.passwordConfirm}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="name">
          <Form.Label className="business-text">이름</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            placeholder="성함을 입력해주세요"
            className="business-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
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
            isInvalid={!!errors.phone}
            placeholder="전화번호를 입력해주세요"
            className="business-input"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" disabled={loading} className="business-btn">
          {loading ? "로딩 중..." : "가입"}
        </Button>
      </Form>
    </div>
  );
};

export default MemberSignup;
