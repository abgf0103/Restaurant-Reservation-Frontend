import { useNavigate } from "react-router-dom";
import "./css/preUserEdit.css";
import { useState } from "react";

const PreUserEdit = () => {
  const navigate = useNavigate();

  const gore = () => {
    navigate("/user/signup");
  };
  const gobe = () => {
    navigate("/user/businessSignup");
  };

  return (
    <div>
      <div className="text1">
        <h1>예약맨 회원가입</h1>
        <hr />
        <h4 className="text2">예약맨에 오신걸 환영합니다</h4>
      </div>
      <div className="chooseUser">
        <div className="oo">
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="imo1"
              viewBox="0 0 16 16"
            >
              <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M6 6.75v8.5a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2.75a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .5 0" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="imo2"
              viewBox="0 0 16 16"
            >
              <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a1 1 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207" />
              <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
            </svg>
          </p>
          <button type="button" onClick={gore} className="button1">
            개인 회원 가입하기
          </button>
        </div>
        <button type="button" onClick={gobe} className="button2">
          사업자 회원 가입하기
        </button>
      </div>
    </div>
  );
};

export default PreUserEdit;
