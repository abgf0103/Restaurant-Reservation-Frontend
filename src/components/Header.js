import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { getUserInfo, removeUserInfo } from "../hooks/userSlice";
import { useDispatch } from "react-redux";
import { removeTokenInfo } from "../hooks/tokenSlice";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormControl, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "../api/instance";
import logoImg from "../img/logo.png";
import Notification from "./Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(getUserInfo); // Redux에서 로그인된 사용자 정보 가져오기
    const dispatch = useDispatch();

    const [isMobileView, setIsMobileView] = useState(false); // 모바일 뷰 판단을 위한 상태

    // 화면 크기에 따라 모바일 뷰 상태 업데이트
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 994); // 994 이하일 때 드롭다운 버튼 생성
        };

        // 초기 설정 및 resize 이벤트 리스너 추가
        handleResize();
        window.addEventListener("resize", handleResize);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem("tokenInfo");
        localStorage.removeItem("userInfo");
        dispatch(removeUserInfo());
        dispatch(removeTokenInfo());
        navigate("/");
    };

    const goBack = () => {
        navigate(-1);
    };

    const [searchKeyword, setSearchKeyword] = useState([]);

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const searchStore = (keyword) => {
        instance.get(`/store/search?searchKeyword=${keyword}`).then((res) => {
            const result = res.data;
            navigate("/", { state: { result } });
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchStore(searchKeyword);
    };

    const goToMypage = () => {
        navigate("/user/mypage");
    };

    console.log(userInfo);

    return (
        <header>
            <Navbar expand="lg" className="header-nav">
                <Container id="headerContainer">
                    {window.location.pathname === "/" ? null : (
                        <Button id="back" onClick={goBack}>
                            ←
                        </Button>
                    )}
                    <Navbar.Brand href="/">
                        <img src={logoImg} alt="Logo" className="logoImg" />
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
                        <Button id="search" type="submit">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button>
                    </Form>
                    {isMobileView ? (
                        // 모바일 상태
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic"></Dropdown.Toggle>
                            <Dropdown.Menu id="dropdown-menu">
                                {userInfo && userInfo.username ? (
                                    //모바일 로그인 상태
                                    <Dropdown.Item id="dropdown-item">
                                        <div className="btn-container">
                                            <div
                                                onClick={goToMypage}
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    border: "1.5px solid var(--secondary-color)",
                                                    overflow: "hidden",
                                                    backgroundImage: `url(${process.env.REACT_APP_HOST}/file/viewId/${userInfo.fileId})`,
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover",
                                                    cursor: "pointer",
                                                }}
                                            ></div>
                                            {userInfo.username && <Notification />}
                                            <Button onClick={handleLogout} id="logout">
                                                로그아웃
                                            </Button>
                                        </div>
                                    </Dropdown.Item>
                                ) : (
                                     // 모바일 로그아웃 상태
                                    <div className="btn-container">
                                        <Dropdown.Item id="dropdown-item">
                                            <Button id="login" onClick={() => navigate("/user/login")}>
                                                로그인
                                            </Button>
                                        </Dropdown.Item>
                                        <Dropdown.Item id="dropdown-item">
                                            <Button id="join" onClick={() => navigate("/user/PreUserEdit")}>
                                                회원가입
                                            </Button>
                                        </Dropdown.Item>
                                    </div>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        // PC 상태
                        <div id="user-buttons">
                            {userInfo && userInfo.username ? (
                                // PC 로그인 상태
                                <>
                                    {userInfo.username && <Notification />}
                                    {userInfo.fileId ? (
                                        <Link to="/user/mypage" style={{ width: "40px", height: "40px" }}>
                                            {/* 프로필 사진이 있을 경우 */}
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    border: "1.5px solid var(--secondary-color)",
                                                    overflow: "hidden",
                                                    backgroundImage: `url(${process.env.REACT_APP_HOST}/file/viewId/${userInfo.fileId})`,
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover",
                                                }}
                                            ></div>
                                        </Link>
                                    ) : (
                                        // 프로필 사진이 없으면 기본 아이콘 표시
                                        <Link to="/user/mypage" style={{ width: "40px", height: "40px" }}>
                                            <FontAwesomeIcon
                                                className="mypage-default-icon"
                                                icon={faCircleUser}
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    border: "1.5px solid var(--secondary-color)",
                                                    color: "#212529",
                                                }}
                                            />
                                        </Link>
                                    )}
                                    <span className="nickname">{userInfo.name + "님"} </span>
                                    <Button onClick={handleLogout} id="logout">
                                        로그아웃
                                    </Button>
                                </>
                            ) : (
                                 // 로그아웃 상태
                                <>
                                    <Button id="login" onClick={() => navigate("/user/login")}>
                                        로그인
                                    </Button>
                                    <Button id="join" onClick={() => navigate("/user/PreUserEdit")}>
                                        회원가입
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
