import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import instance from "../../api/instance";
import { setUserInfo } from "../../hooks/userSlice";
import { useDispatch } from "react-redux";

const UserEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector(getUserInfo);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: userInfo.id,
    username: userInfo.username,
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    password: location.state.password,
    newPassword: userInfo.newPassword,
    active: userInfo.active,
    roleNum: `${userInfo.roles[0].id}`,
    businessNum: "", // 사업자 등록 번호
  });

  useEffect(() => {
    if (userInfo.id) {
    }
  }, [userInfo.id]);

  const onChange = (e) => {
    const { id, value } = e.target;

    // 전화번호가 11자리를 넘지 않도록 제한
    if (id === "phone" && value.replace(/-/g, "").length <= 11) {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    } else if (id !== "phone") {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const { name, phone } = formData;

    // 이름 유효성 검사: 한글 2자 이상, 10자 이하
    const nameRegex = /^[가-힣]{2,10}$/;
    if (!nameRegex.test(name)) {
      Swal.fire({
        title: "오류",
        text: "이름은 한글 2자 이상 10자 이하로 입력해 주세요.",
        icon: "error",
      });
      return false;
    }

    // 전화번호 유효성 검사: 숫자 11자리, 하이픈 포함
    const phoneRegex = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(phone)) {
      Swal.fire({
        title: "오류",
        text: "전화번호는 11자리 숫자와 하이픈(-)을 포함해야 합니다.",
        icon: "error",
      });
      return false;
    }

    // 전화번호 길이 체크 (하이픈 포함 총 13자리로 검증)
    const phoneWithoutHyphen = phone.replace(/-/g, "");
    if (phoneWithoutHyphen.length !== 11) {
      Swal.fire({
        title: "오류",
        text: "전화번호는 정확히 11자리여야 합니다.",
        icon: "error",
      });
      return false;
    }

    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) {
      return; // 유효성 검사 실패 시, 제출하지 않음
    }

    console.log(userInfo.phone);

    // 백엔드에 수정 요청
    instance
      .put(`/member/user/update`, {
        id: userInfo.id,
        username: userInfo.username,
        name: formData.name,
        phone: formData.phone,
        email: userInfo.email,
        roleNum: formData.roleNum,
        active: true,
        password: formData.password || userInfo.password,
        businessNum: "",
      })
      .then((response) => {
        Swal.fire({
          title: "성공",
          text: "사용자 정보가 성공적으로 수정되었습니다.",
          icon: "success",
        });
        // 수정된 사용자 정보를 로컬 저장소에 저장
        instance
          .get("/user/me")
          .then((res) => {
            console.log(res);
            if (res) {
              dispatch(setUserInfo(res.data));

              localStorage.setItem("userInfo", JSON.stringify(res.data));
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "오류",
              text: "사용자 정보를 불러오는 데 실패했습니다.",
              icon: "error",
            });
          });

        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          title: "수정 실패",
          text: error.response?.data || "사용자 정보를 수정할 수 없습니다.",
          icon: "error",
        });
      });
  };

  return (
    <div className="container">
      <h2>회원 정보 수정</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            onChange={onChange}
            placeholder="이름을 입력하세요"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>전화번호</Form.Label>
          <Form.Control
            type="text"
            value={formData.phone}
            onChange={onChange}
            placeholder="전화번호를 입력하세요"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={userInfo.password}
            onChange={onChange}
            placeholder="비밀번호를 입력하세요 (변경하려면 입력)"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          수정하기
        </Button>
      </Form>
    </div>
  );
};

export default UserEdit;
