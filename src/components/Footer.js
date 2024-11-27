import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice"
import { useState } from 'react';
import instance from './../api/instance';

const Footer = () => {
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    const [isManager, setIsManager] = useState(false);

    if (userInfo.id){
        instance.get(`/user/isManagerByUserId?userId=${userInfo.id}`)
        .then((res) =>{
            if(res.data === 1){
                setIsManager(true);
            }
        })
    }
    

    return (
        <footer>
            <Navbar bg="light" data-bs-theme="light">
                <Container className="footerContainer">
                <Nav className="me-auto footerContainer">
                    <Nav.Link href="/">메인페이지</Nav.Link>
                    <Nav.Link href="/user/FavoritePage">즐겨찾기 페이지</Nav.Link>
                    <Nav.Link href="/user/myreserve">나의 예약페이지</Nav.Link>
                    {/* 사업자 회원만 보이는 나의 가게 페이지*/}
                    {isManager && <Nav.Link href="/store/mystore">나의 가게 페이지</Nav.Link>}
                    <Nav.Link href="/user/mypage">마이페이지</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        </footer>
    );
};
export default Footer;
