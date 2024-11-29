import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Card } from "react-bootstrap";
import { convertToWon } from "../../utils/tools";
import Slider from "react-slick";
import "./css/Menu.css";

const MenuList = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const storeId = location.state;

    const [menuList, setMenuList] = useState([]);

    // 슬라이드 설정
    const settings = {
        dots: false, // 점 네비게이션 표시
        infinite: false, // 무한 루프 설정
        speed: 500, // 슬라이드 전환 속도
        slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
        slidesToScroll: 1, // 드래그할 때 한 번에 이동할 슬라이드 수
        variableWidth: false, // 슬라이드의 너비 자동 조정 (비활성화)
        arrows: false, // 화살표 버튼 비활성화
        draggable: false, // 드래그 활성화
        swipeToSlide: true, // 드래그한 만큼 슬라이드가 이동하도록 설정
        centerMode: false, // 센터모드 비활성화 (중앙 정렬)
    };

    // 슬라이드 설정
    const settings2 = {
        dots: false, // 점 네비게이션 표시
        infinite: true, // 무한 루프 설정
        speed: 500, // 슬라이드 전환 속도
        slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
        slidesToScroll: 1, // 드래그할 때 한 번에 이동할 슬라이드 수
        variableWidth: false, // 슬라이드의 너비 자동 조정 (비활성화)
        arrows: false, // 화살표 버튼 비활성화
        draggable: true, // 드래그 활성화
        swipeToSlide: true, // 드래그한 만큼 슬라이드가 이동하도록 설정
        centerMode: false, // 센터모드 비활성화 (중앙 정렬)
    };

    // 가게 메뉴 가져오기
    useEffect(() => {
        instance
            .get("/store/menu/getMenuListByStoreId?storeId=" + storeId)
            .then((res) => {
                console.log(res.data);
                setMenuList(res.data); // 사용자 가게 목록 설정
            })
            .catch((error) => {
                console.error("메뉴 리스트 가져오기 실패:", error);
                Swal.fire({
                    title: "실패",
                    text: "메뉴 리스트 가져오는 데 실패했습니다.",
                    icon: "error",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    const sliderSettings = menuList.length >= 5 ? settings2 : settings;

    return (
        <>
            <div style={{ width: "100%" }}>
                {menuList.length > 0 ? (
                    <Slider {...sliderSettings}>
                        {menuList.map((item, index) => (
                            <div key={index}>
                                <img
                                    src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                    alt={`slide ${index}`}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderTopRightRadius: "8px",
                                        borderTopLeftRadius: "8px",
                                    }}
                                />
                                <Card.Body className="menuInfo">
                                    <Card.Title>{item.menuName}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Card.Text>{convertToWon(item.price)}</Card.Text>
                                </Card.Body>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>메뉴가 없습니다.</p>
                )}
            </div>
            {/* {menuList.length > 0 ? (
                <ul>
                    {menuList.map((item) => (
                        <li key={item.menuId}>
                            <Card style={{ width: "18rem" }}>
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                />
                                <Card.Body>
                                    <Card.Title>{item.menuName}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Card.Text>{convertToWon(item.price)}</Card.Text>
                                </Card.Body>
                            </Card>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>메뉴가 없습니다.</p>
            )} */}
        </>
    );
};
export default MenuList;
