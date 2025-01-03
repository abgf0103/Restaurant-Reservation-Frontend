import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";
import { convertToWon } from "../../utils/tools";

const MenuManagement = () => {
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
        navigate(`/store/menu/edit`, {
            state: { storeId: storeId, menuId: menuId },
        });
    };

    //메뉴 삭제 클릭
    const menuDeleteClick = (item) => {
        Swal.fire({
            title: item.menuName + "을 삭제하겠습니까?",
            text: "삭제 후 복구할 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: item.menuName + "을 <br>삭제했습니다",
                    text: "삭제된 메뉴는 복구할 수 없습니다",
                    icon: "success",
                }).then((result) => {
                    instance.get(`/store/menu/delete?menuId=${item.menuId}`);
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        });
    };

    //메뉴 생성 클릭
    const registerMenuClick = () => {
        // 페이지가 마운트될 때마다 스크롤을 맨 위로 설정
        window.scrollTo(0, 0);
        navigate(`/store/menu/register`, { state: { storeId: storeId } });
    };

    return (
        <main className="menuManagementMain">
            <h2 className="title">메뉴 관리</h2>
            {menuList.length > 0 ? (
                <ul className="menuListManagement">
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
                                    <Button variant="warning" onClick={() => menuEditClick(item.menuId)}>
                                        {/* 버튼을 누르면 가게ID를 들고 수정 페이지로 이동 */}
                                        메뉴 수정
                                    </Button>
                                    <Button variant="danger" onClick={() => menuDeleteClick(item)}>
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
                <Button className="addMenuBtn" variant="colorSecondary" onClick={() => registerMenuClick(storeId)}>
                    +
                </Button>
            </Card>
        </main>
    );
};
export default MenuManagement;
