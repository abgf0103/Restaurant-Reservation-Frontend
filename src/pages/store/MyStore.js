import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";

const MyStore = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            navigate("/user/login");
        }
    }, [navigate, userInfo]);

    // 내 가게 가져오기
    useEffect(() => {
        instance
            .get("store/mystore")
            .then((res) => {
                console.log(res.data);
                setStores(res.data); // 사용자 가게 목록 설정
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

    const handleEditClick = (storeId) => {
        // 가게 수정 페이지로 이동하며, 수정할 가게 ID 전달
        navigate(`/store/edit/${storeId}`);
    };

    //가게 등록 버튼 클릭시 가게 등록 url로 이동
    const registerStoreClick = () => {
        navigate(`/store/register`);
    }

    const handleMenuClick = (storeId) => {
        // 가게 수정 페이지로 이동하며, 수정할 가게 ID 전달
        navigate(`/store/menu/list/${storeId}`);
    };


    if (loading) {
        return <div>로딩 중...</div>;
    }


    return (
        <div>
            <h2>나의 가게 정보 페이지</h2>
            <Button variant="primary" 
                    onClick={() => registerStoreClick()}
            >
                등록 요청
            </Button>
            {stores.length > 0 ? (
                <ul>
                    {stores.map((item) => (
                        <li key={item.storeId}>
                            <Card style={{ width: "18rem" }}>
                                <Card.Img variant="top" src="holder.js/100px180" />
                                    <Card.Body>
                                        <Link
                                        to={"/store/info" }
                                        state={ item.storeId }
                                        >
                                        <Card.Title>{item.storeName}</Card.Title>
                                        </Link>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Button variant="primary" onClick={() => handleEditClick(item.storeId)}>
                                            {/* 버튼을 누르면 가게ID를 들고 수정 페이지로 이동 */}
                                            가게 정보 수정
                                        </Button>
                                        <Button variant="warning" onClick={() => handleMenuClick(item.storeId)}>
                                            {/* 버튼을 누르면 가게ID를 들고 메뉴 관리 페이지로 이동 */}
                                            가게 메뉴 관리
                                        </Button>
                                    </Card.Body>
                            </Card>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>가게가 없습니다.</p>
            )}
        </div>
    );
};
export default MyStore;
