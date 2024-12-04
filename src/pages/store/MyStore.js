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

    const [storeRatings, setStoreRatings] = useState({}); // 각 가게의 평점 저장
    const [storeReviewCounts, setStoreReviewCounts] = useState({}); // 각 가게의 리뷰 수 저장

    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            navigate("/user/login");
        }
    }, [navigate, userInfo]);

    // 리뷰 평균 평점 구하기
    const getRatingAvgByStoreId = async (storeId) => {
        try {
            const res = await instance.get(`/review/getRatingAvgByStoreId?storeId=${storeId}`);
            return res.data || 0;
        } catch (error) {
            console.error("Error fetching rating:", error);
        }
    };

    // 리뷰 개수 구하기
    const getReviewCountByStoreId = async (storeId) => {
        try {
            const res = await instance.get(`/review/getReviewCountByStoreId?storeId=${storeId}`);
            return res.data; // 리뷰 수가 없으면 0
        } catch (error) {
            console.error("Error fetching review count:", error);
        }
    };

    // storeData 배열의 각 storeId에 대한 평점과 리뷰 수를 비동기적으로 가져오기
    const fetchRatingsAndReviews = async () => {
        console.log()
        const ratings = {};
        const reviewCounts = {};

        for (const store of stores) {
            const rating = await getRatingAvgByStoreId(store.storeId);
            const reviewCount = await getReviewCountByStoreId(store.storeId);

            ratings[store.storeId] = rating;
            reviewCounts[store.storeId] = reviewCount;
        }

        setStoreRatings(ratings);
        setStoreReviewCounts(reviewCounts);
    };

    // storeData가 업데이트 될 때마다 평점과 리뷰 수 가져오기
    useEffect(() => {
        if (stores.length > 0) {
            fetchRatingsAndReviews();
        }
    }, [stores]);

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

    const handleReserveClick = (storeId) => {
        // 가게 예약 조회 페이지로 이동하며 가게 ID 전달
        navigate(`/store/reserve/${storeId}`);
    };

    const handleEditClick = (storeId) => {
        // 가게 수정 페이지로 이동하며 수정할 가게 ID 전달
        navigate(`/store/edit/${storeId}`);
    };

    //가게 등록 버튼 클릭시 가게 등록 url로 이동
    const registerStoreClick = () => {
        navigate(`/store/register`);
    };

    const handleMenuClick = (storeId) => {
        // 가게 메뉴 관리 페이지로 이동하며 가게 ID 전달
        navigate(`/store/menu/management/${storeId}`);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <main>
            <Button variant="colorSecondary" onClick={() => registerStoreClick()}>
                등록 요청
            </Button>
            {stores.length > 0 ? (
                <ul className="storeList-card-list">
                    {stores.map((item) => (
                        <li key={item.storeId}>
                            <Card className="storeList-card">
                                {item.isActive === 1 ? (
                                    <Link to={"/store/info"} state={item.storeId}>
                                        <Card.Img
                                            className="myStoreList-img"
                                            variant="top"
                                            src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                        />
                                    </Link>
                                ) : (
                                    <Card.Img
                                        className="myStoreList-img"
                                        variant="top"
                                        src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                    />
                                )}

                                <Card.Body>
                                    {item.isActive === 1 ? (
                                        <Link to={"/store/info"} state={item.storeId}>
                                            <Card.Title>{item.storeName}</Card.Title>
                                            <Card.Text>{item.description}</Card.Text>
                                            <Card.Text>
                                                ⭐{storeRatings[item.storeId] || 0}(
                                                {storeReviewCounts[item.storeId] || 0}) {item.identity}
                                            </Card.Text>
                                        </Link>
                                    ) : (
                                        <>
                                            <Card.Title>{item.storeName}</Card.Title>
                                            <Card.Text>{item.description}</Card.Text>
                                        </>
                                    )}

                                    {item.isActive === 1 && (
                                        <>
                                            <Button variant="success" onClick={() => handleReserveClick(item.storeId)}>
                                                예약 조회
                                            </Button>{" "}
                                            <Button variant="colorSecondary" onClick={() => handleEditClick(item.storeId)}>
                                                가게 정보 수정
                                            </Button>
                                            <Button variant="warning" onClick={() => handleMenuClick(item.storeId)}>
                                                가게 메뉴 관리
                                            </Button>
                                        </>
                                    )}
                                    {item.isActive === 0 && (
                                        <>
                                            <Button variant="danger" disabled>
                                                등록 요청 중
                                            </Button>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>가게가 없습니다.</p>
            )}
        </main>
    );
};
export default MyStore;
