import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

const Footer = () => {
    
    // const navigate = useNavigate();
    // const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  
  
    // 로그인 상태 체크
    // useEffect(() => {
    //   if (!userInfo.username) {
    //     navigate("/user/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    //   }
    // }, [navigate, userInfo]);

    return (
        <footer>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/">메인페이지</Nav.Link>
                    <Nav.Link href="/store/search">검색페이지</Nav.Link>
                    <Nav.Link href="/user/myreserve">나의 예약페이지</Nav.Link>
                    <Nav.Link href="/store/mystore">나의 가게 페이지</Nav.Link>{" "}
                    {/* 사업자 회원만 보이게 */}
                    <Nav.Link href="/user/mypage">마이페이지</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        </footer>
    );
};
export default Footer;
