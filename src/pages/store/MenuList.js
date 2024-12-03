import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import instance from "../../api/instance";
import { Card } from "react-bootstrap";
import { convertToWon } from "../../utils/tools";
import Slider from "react-slick";
import "./css/Menu.css";

const MenuList = () => {
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const storeId = location.state;

    const [menuList, setMenuList] = useState([]);

    const scrollRef = useRef(null);
    const [isMouseOver, setIsMouseOver] = useState(false); // 마우스 오버 상태
    const isDragging = useRef(false); // 마우스 드래그 상태 추적
    const startX = useRef(0); // 드래그 시작 위치
    const scrollLeft = useRef(0); // 드래그 시작 시 스크롤 위치

    // 마우스가 div 영역에 들어갔을 때
    const handleMouseEnter = () => {
        setIsMouseOver(true);
    };

    // 마우스가 div 영역에서 나갔을 때
    const handleMouseLeave = () => {
        setIsMouseOver(false);
        isDragging.current = false; // 마우스가 나가면 드래그 상태 종료
    };

    // 마우스 휠 이벤트 처리 함수
    const handleWheel = (e) => {
        if (isMouseOver) {
            // 마우스가 div 영역에 있을 때만 수평 스크롤 가능
            if (e.deltaY !== 0) {
                //e.preventDefault();  // 수직 스크롤 방지
                if (scrollRef.current) {
                    scrollRef.current.scrollLeft += e.deltaY; // 수평 스크롤 이동
                }
            }
        } else {
            // 마우스가 div 영역을 벗어났을 때는 기본적으로 세로 스크롤 가능
            return; // 이 경우 수직 스크롤을 허용
        }
    };

    // 마우스 드래그 시작
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX; // 드래그 시작 위치
        scrollLeft.current = scrollRef.current.scrollLeft; // 드래그 시작 시 스크롤 위치
        e.preventDefault(); // 기본 드래그 방지
    };

    // 마우스 드래그 중
    const handleMouseMove = (e) => {
        if (!isDragging.current) return; // 드래그 상태일 때만 처리

        const distance = e.clientX - startX.current; // 드래그한 거리
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft.current - distance; // 스크롤 이동
        }
    };

    // 마우스 드래그 종료
    const handleMouseUp = () => {
        isDragging.current = false; // 드래그 종료
    };

    // 전체 화면에서 수직 스크롤을 방지하는 useEffect
    useEffect(() => {
        // 전체 화면에서 수직 스크롤 방지
        const preventDefaultScroll = (e) => {
            if (isMouseOver) {
                e.preventDefault(); // 수직 스크롤 방지
            }
        };

        // 전체 화면에서 수직 스크롤 방지
        document.body.addEventListener("wheel", preventDefaultScroll, { passive: false });

        // 컴포넌트가 언마운트될 때 수직 스크롤 방지 해제
        return () => {
            document.body.removeEventListener("wheel", preventDefaultScroll);
        };
    }, [isMouseOver]);

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

    return (
        <>
            <div style={{ width: "100%" }}>
                <div
                    ref={scrollRef}
                    onWheel={handleWheel} // 마우스 휠 이벤트 핸들러
                    onMouseEnter={handleMouseEnter} // 마우스가 div 영역에 들어갔을 때
                    onMouseLeave={handleMouseLeave} // 마우스가 div 영역을 떠났을 때 (드래그 종료와 마우스 오버 상태 업데이트)
                    onMouseDown={handleMouseDown} // 마우스 클릭 시작
                    onMouseMove={handleMouseMove} // 마우스 드래그 중
                    onMouseUp={handleMouseUp} // 마우스 클릭 종료
                    className="horizontal-scroll-menu"
                >
                    {menuList.map((item, index) => (
                        <div key={index} className="horizontal-item">
                                <img
                                    src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                    alt={`slide ${index}`}
                                    className="menuImg"
                                />
                            <Card.Body className="menuInfo">
                                <Card.Title className="menuTitle">{item.menuName}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Card.Text className="menuPrice">{convertToWon(item.price)}</Card.Text>
                            </Card.Body>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
export default MenuList;
