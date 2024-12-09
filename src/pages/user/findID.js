import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import instance from "../../api/instance"; // 커스텀 axios 인스턴스를 임포트
import "./css/findID.css";
import { Button, Container, Form } from "react-bootstrap";

const FindIdForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // navigate 함수

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  //폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await instance.get("/member/user/findID", {
        params: { phone: phone, email: email },
      });

      console.log(response);
      console.log(response.data);

      if (response.data.success) {
        setMessage(`아이디: ${response.data.cause}`);
        // cause 값을 명확하게 전달
        navigate("/user/findIdResult", {
          state: { cause: response.data.cause },
        });
      } else {
        setMessage("입력된 정보에 해당하는 아이디가 없습니다.");
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Container className="find-id-cover">
        <div className="find-id-main">
          <h4>아이디 찾기</h4>

          <Form onSubmit={handleSubmit} className="findIdBox">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력하세요"
              className="findid-id-input"
            />
            <Form.Group controlId="phone">
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="전화번호를 입력하세요"
                className="findid-pw-input"
              />
            </Form.Group>
            <Button type="submit" disabled={loading} className="find-id-btn">
              {loading ? "로딩 중..." : "아이디 찾기"}
            </Button>
          </Form>
          {message && (
            <div className="find-id-message">
              <p>{message}</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};

export default FindIdForm;
