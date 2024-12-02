import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { getUserInfo, removeUserInfo } from "../hooks/userSlice";
import { useDispatch } from "react-redux";
import { removeTokenInfo } from "../hooks/tokenSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormControl, Dropdown } from "react-bootstrap";
import { useState } from "react";
import instance from "../api/instance";
import logoImg from "../img/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // Redux에서 로그인된 사용자 정보 가져오기
  const dispatch = useDispatch();

  // 로그아웃 처리
  const handleLogout = () => {
    // 로컬스토리지에서 로그인 정보 및 토큰 삭제
    localStorage.removeItem("tokenInfo");
    localStorage.removeItem("userInfo");

    // Redux 상태 초기화
    dispatch(removeUserInfo());
    dispatch(removeTokenInfo());

    // 메인 페이지로 리다이렉트
    navigate("/");
  };

  // '/'경로인 상태면 goBack버튼이 보이지 않게

  const goBack = () => {
    navigate(-1); // 이전 페이지로 돌아간다
  };

  const [searchKeyword, setSearchKeyword] = useState([]); // 검색어 상태 관리

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value); // 검색어 입력 시 상태 업데이트
  };

  const searchStore = (keyword) => {
    instance.get(`/store/search?searchKeyword=${keyword}`).then((res) => {
      console.log(res.data);
      const result = res.data;
      console.log(result);
      navigate("/", { state: { result } });
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    //검색어가 변경될때마다 키워드 검색결과 호출
    searchStore(searchKeyword);
  };

  return (
    <header>
      <Navbar expand="lg">
        <Container id="headerContainer">
          {/* 기본경로에선 goBack 버튼 숨기기 */}
          {window.location.pathname === "/" ? (
            <></>
          ) : (
            <Button id="back" onClick={goBack}>
              ←
            </Button>
          )}
          <Navbar.Brand href="/">
            <img src={logoImg} alt="" className="logoImg" />
          </Navbar.Brand>
          <Form onSubmit={handleSearchSubmit} id="search-form">
            <div id="search-bar">
              <FormControl
                type="search"
                placeholder="검색어를 입력하세요"
                className="mr-sm-2"
                value={searchKeyword}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              id="search"
              type="submit"
              style={{ position: "absolute", top: "2px", right: "15px" }}
            >
              검색
            </Button>
          </Form>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic"></Dropdown.Toggle>

            <Dropdown.Menu id="dropdown-menu">
              {userInfo && userInfo.username ? (
                // 로그인 상태일 때만 보여줌 (로그아웃 버튼)
                <Dropdown.Item id="dropdown-item">
                  <span className="nickname">{userInfo.username + "님"} </span>
                  <Button onClick={handleLogout} id="logout">
                    로그아웃
                  </Button>
                </Dropdown.Item>
              ) : (
                <>
                  {/* 비로그인 상태일 때만 보여줌 (로그인/회원가입 버튼) */}
                  <div className="btn-container">
                    <Dropdown.Item id="dropdown-item">
                      <Button
                        id="login"
                        onClick={() => navigate("/user/login")}
                      >
                        로그인
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item id="dropdown-item">
                      <Button
                        id="join"
                        onClick={() => navigate("/user/PreUserEdit")}
                      >
                        회원가입
                      </Button>
                    </Dropdown.Item>
                  </div>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
