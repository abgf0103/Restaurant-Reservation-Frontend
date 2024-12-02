import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/preUserEdit.css";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser as faCircleUserRegular } from "@fortawesome/free-regular-svg-icons";
import { faCircleUser as faCircleUserSolid } from "@fortawesome/free-solid-svg-icons"; // solid 아이콘 임포트
import { faBuilding as faBuildingRegular } from "@fortawesome/free-regular-svg-icons";
import { faBuilding as faBuildingSolid } from "@fortawesome/free-solid-svg-icons"; // 사업자 아이콘의 solid 버전

const PreUserEdit = () => {
  const navigate = useNavigate();

  // 개인 회원 가입 버튼 아이콘 상태
  const [userIcon, setUserIcon] = useState(faCircleUserRegular);

  // 사업자 회원 가입 버튼 아이콘 상태
  const [businessIcon, setBusinessIcon] = useState(faBuildingRegular);

  const gore = () => {
    navigate("/user/signup");
  };
  const gobe = () => {
    navigate("/user/businessSignup");
  };

  // 개인 회원 가입 버튼 hover 상태에서 아이콘 변경
  const handleUserMouseEnter = () => {
    setUserIcon(faCircleUserSolid);
  };

  const handleUserMouseLeave = () => {
    setUserIcon(faCircleUserRegular);
  };

  // 사업자 회원 가입 버튼 hover 상태에서 아이콘 변경
  const handleBusinessMouseEnter = () => {
    setBusinessIcon(faBuildingSolid);
  };

  const handleBusinessMouseLeave = () => {
    setBusinessIcon(faBuildingRegular);
  };

  return (
    <Form className="edit-cover">
      <div className="text1">
        <h1>예약맨 회원가입</h1>
        <hr />
        <h4 className="text2">예약맨에 오신걸 환영합니다</h4>
      </div>
      <div className="edit-main-cover">
        <div className="chooseUser1">
          <div>
            <FontAwesomeIcon
              icon={userIcon} // 개인 회원 가입 아이콘 상태
              size="7x"
              className="edit-icon"
            />
            <Button
              type="button"
              onClick={gore}
              className="edit-button"
              onMouseEnter={handleUserMouseEnter} // 개인 회원 가입 hover 시 아이콘 변경
              onMouseLeave={handleUserMouseLeave} // hover 벗어날 때 아이콘 복원
            >
              개인 회원 가입하기
            </Button>
          </div>
        </div>

        <div className="chooseUser2">
          <div>
            <FontAwesomeIcon
              icon={businessIcon} // 사업자 회원 가입 아이콘 상태
              size="7x"
              className="edit-icon"
            />
            <Button
              type="button"
              onClick={gobe}
              className="edit-button"
              onMouseEnter={handleBusinessMouseEnter} // 사업자 회원 가입 hover 시 아이콘 변경
              onMouseLeave={handleBusinessMouseLeave} // hover 벗어날 때 아이콘 복원
            >
              사업자 회원 가입하기
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default PreUserEdit;
