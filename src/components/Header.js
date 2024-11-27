import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { getUserInfo, removeUserInfo } from "../hooks/userSlice";
import { useDispatch } from "react-redux";
import { removeTokenInfo } from "../hooks/tokenSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormControl } from "react-bootstrap";
import { useState } from "react";
import instance from "../api/instance";

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
                <Container>
                    {/* 기본경로에선 goBack 버튼 숨기기 */}
                    {window.location.pathname === "/" ? (
                        <></>
                    ) : (
                        <Button variant="light" onClick={goBack}>
                            ←
                        </Button>
                    )}
                    <Navbar.Brand href="/">예약맨</Navbar.Brand>
                    <Form inline onSubmit={handleSearchSubmit}>
                        <FormControl
                            type="search"
                            placeholder="검색어를 입력하세요"
                            className="mr-sm-2"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        />
                        <Button variant="outline-warning" type="submit">
                            검색
                        </Button>
                    </Form>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="header-login">
                        <Nav className="me-auto">
                            {/* 로그인된 사용자에 따라 로그인 또는 로그아웃 버튼 표시 */}
                            {userInfo && userInfo.username ? (
                                <Nav>
                                    <span>{userInfo.username} </span>
                                    <Button onClick={handleLogout}>로그아웃</Button>
                                </Nav>
                            ) : (
                                <Link to="/user/login">
                                    <button>로그인</button>
                                </Link>
                            )}
                            {userInfo && userInfo.username ? (
                                <></>
                            ) : (
                                <Link to="/user/PreUserEdit">
                                    <button>회원가입</button>
                                </Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};
export default Header;
