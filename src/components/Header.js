import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useSelector } from "react-redux";
import { getUserInfo, removeUserInfo } from "../hooks/userSlice";
import { useDispatch } from "react-redux";
import { removeTokenInfo } from "../hooks/tokenSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

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
    
    const goBack = () => {
        navigate(-1); // 이전 페이지로 돌아간다
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
            <Button variant="light" onClick={goBack}>←</Button>
            <Navbar.Brand href="/">예약맨</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            {/* 로그인된 사용자에 따라 로그인 또는 로그아웃 버튼 표시 */}
            {userInfo && userInfo.username ? (
                <div>
                <span>{userInfo.username}님, 안녕하세요!</span>
                <button onClick={handleLogout}>로그아웃</button>
                </div>
            ) : (
                <Link to="/user/login">
                <button>로그인</button>
                </Link>
            )}
            {userInfo && userInfo.username ? (
                <div></div>
            ) : (
                <Link to="/user/signup">
                <button>회원가입</button>
                </Link>
            )}
            <Link to="/fileTest">
                <button>파일 업로드 테스트</button>
                </Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
    );
};
export default Header;
