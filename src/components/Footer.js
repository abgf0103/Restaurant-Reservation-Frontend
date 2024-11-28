import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import { useState, useEffect } from "react";
import instance from "./../api/instance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faHouse, faStar, faStore, faUser } from "@fortawesome/free-solid-svg-icons";

const Footer = ({ activeFooterIcon, onFooterIconClick }) => {
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    const [isManager, setIsManager] = useState(false);

    // 기본 색상 (연한 회색)과 클릭된 색상 (검은색)
    const iconStyle = (iconName) => ({
        color: activeFooterIcon === iconName ? "black" : "#b0b0b0", // 클릭된 아이콘은 검은색, 아니면 연한 회색
        cursor: "pointer", // 마우스 오버 시 클릭할 수 있음을 알리기 위해
    });
    // useEffect를 사용하여 userInfo.id 변경 시 isManager 상태를 갱신
    useEffect(() => {
        if (userInfo.id) {
            instance.get(`/user/isManagerByUserId?userId=${userInfo.id}`).then((res) => {
                if (res.data === 1) {
                    setIsManager(true);
                } else {
                    setIsManager(false);
                }
            });
        }
    }, [userInfo.id]); // userInfo.id가 변경될 때마다 실행

    return (
        <footer>
            <Navbar bg="light" data-bs-theme="light">
                <Container className="footerContainer">
                    <Nav className="footer-nav">
                        <Nav.Link href="/" onClick={() => onFooterIconClick("home")}>
                            <FontAwesomeIcon icon={faHouse} style={iconStyle("home")} />
                        </Nav.Link>
                        <Nav.Link href="/user/FavoritePage" onClick={() => onFooterIconClick("favorite")}>
                            <FontAwesomeIcon icon={faStar} style={iconStyle("favorite")} />
                        </Nav.Link>
                        <Nav.Link href="/user/myreserve" onClick={() => onFooterIconClick("reserve")}>
                            <FontAwesomeIcon icon={faCalendarDays} style={iconStyle("reserve")} />
                        </Nav.Link>
                        {/* 사업자 회원만 보이는 나의 가게 페이지 */}
                        {isManager && (
                            <Nav.Link href="/store/mystore" onClick={() => onFooterIconClick("store")}>
                                <FontAwesomeIcon icon={faStore} style={iconStyle("store")} />
                            </Nav.Link>
                        )}
                        <Nav.Link href="/user/mypage" onClick={() => onFooterIconClick("mypage")}>
                            <FontAwesomeIcon icon={faUser} style={iconStyle("mypage")} />
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </footer>
    );
};

export default Footer;
