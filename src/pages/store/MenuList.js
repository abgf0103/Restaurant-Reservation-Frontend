import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";

const MenuList = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
    const [loading, setLoading] = useState(true);
    
    const { storeId } = useParams(); // URL에서 storeId를 추출

    const [menuList, setMenuList] = useState([]);

    // 가게 메뉴 가져오기
    useEffect(() => {
        instance
            .get("/store/menu/getMenuListByStoreId?storeId=" + storeId)
            .then((res) => {
                console.log(res.data);
                setMenuList(res.data); // 사용자 가게 목록 설정
            })
            .catch((error) => {
                console.error("나의 가게 가져오기 실패:", error);
                Swal.fire({
                    title: "실패",
                    text: "나의 가게 가져오는 데 실패했습니다.",
                    icon: "error",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            navigate("/user/login");
        }
    }, [navigate, userInfo]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    //메뉴 수정 클릭
    const menuEditClick = (menuId) => {
        navigate(`/store/menu/edit`, {state: { storeId : storeId,
                                                menuId : menuId
         }});
    }

    //메뉴 삭제 클릭
    const menuDeleteClick = (storeId) => {
        console.log("handleDeleteClick");
    }

    //메뉴 생성 클릭
    const registerMenuClick = () => {
        navigate(`/store/menu/register`, {state: { storeId : storeId }});
    }
    return (
        <div>
            <h2>메뉴 관리 페이지</h2>
            {menuList.length > 0 ? (
                <ul>
                    {menuList.map((item) => (
                        <li key={item.menuId}>
                            <Card style={{ width: "18rem" }}>
                                <Card.Img variant="top" src="holder.js/100px180" />
                                    <Card.Body>
                                        <Card.Title>{item.menuName}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Button variant="warning" onClick={() => menuEditClick(item.menuId)}>
                                            {/* 버튼을 누르면 가게ID를 들고 수정 페이지로 이동 */}
                                            메뉴 수정
                                        </Button>
                                        <Button variant="danger" onClick={() => menuDeleteClick(item.menuId)}>
                                            {/* 버튼을 누르면 가게ID를 들고 메뉴 관리 페이지로 이동 */}
                                            메뉴 삭제
                                        </Button>
                                    </Card.Body>
                            </Card>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>메뉴가 없습니다.</p>
            )}
            <Card style={{ width: "25rem" }}>
                <Button variant="primary" 
                        onClick={() => registerMenuClick(storeId)}
                >
                    +
                </Button>
            </Card>
            
        </div>
    );
};
export default MenuList;
