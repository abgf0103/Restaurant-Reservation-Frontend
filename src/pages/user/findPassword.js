import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import { Form, Button, Container, Alert } from "react-bootstrap"; // react-bootstrap 컴포넌트 임포트
import instance from "../../api/instance"; // 커스텀 axios 인스턴스를 임포트
import "./css/findPassword.css";

function FindPassword() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // navigate 함수

  // 폼 제출 처리
  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      email: email,
      username: username,
      name: name,
    };

    try {
      // 서버에 POST 요청을 보내 임시 비밀번호 생성
      const response = await instance.post(
        "/member/user/findPassword",
        requestData
      );

      console.log(response);

      setMessage(response.data.message); // 응답 메시지 설정

      // 결과 페이지로 이동하며 message 전달
      if (response.data) {
        navigate("/user/findPasswordResult", {
          state: { message: response.data.message },
        });
      } else {
        setMessage("입력된 정보에 해당하는 비밀번호가 없습니다");
      }
    } catch (error) {
      console.error("Error fetching temp password:", error);
      setMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container className="cover">
      <h4>비밀번호 찾기</h4>
      <hr />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="이메일을 입력해주세요"
          />
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="아이디를 입력해주세요"
          />
        </Form.Group>

        <Form.Group controlId="name">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="이름을 입력해주세요"
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          임시 비밀번호 발급받기
        </Button>
      </Form>

      {message && (
        <Alert variant="info" className="mt-3">
          <p>{message}</p>
        </Alert>
      )}
    </Container>
  );
}

export default FindPassword;
