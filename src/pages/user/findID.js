import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import instance from "../../api/instance"; // 커스텀 axios 인스턴스를 임포트
import "./css/findID.css";

const FindIdForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // navigate 함수

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    //백엔드에 email전달
    try {
      const response = await instance.get("/member/user/findID", {
        params: { email },
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
        setMessage("이메일에 해당하는 아이디가 없습니다.");
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <main>
        <div className="cover">
          <div className="idtitle">
            <h4>아이디 찾기</h4>
          </div>
          <form onSubmit={handleSubmit} className="findIdBox">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력하세요"
              className="idInput"
            />
            <button type="submit" disabled={loading} className="idbutton">
              {loading ? "로딩 중..." : "아이디 찾기"}
            </button>
          </form>
          {message && (
            <div className="idmessage">
              <p>{message}</p>
            </div>
          )}
        </div>
      </main>
    </main>
  );
};

export default FindIdForm;
