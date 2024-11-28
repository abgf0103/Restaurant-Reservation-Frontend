import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Style.css";
import { getUserInfo } from "../../hooks/userSlice";
import { useSelector } from "react-redux";
import { isNotLoginSwal } from "../../utils/tools";

const FavoritePage = () => {
    const navigate = useNavigate();
    const [storeData, setStoreData] = useState([]);
    const userInfo = useSelector(getUserInfo);
    const [isFavorite, setIsFavorite] = useState({});
    
    const [storeRatings, setStoreRatings] = useState({}); // 각 가게의 평점 저장
    const [storeReviewCounts, setStoreReviewCounts] = useState({}); // 각 가게의 리뷰 수 저장

    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            // 로그인 안 되어 있으면 swal출력 후 로그인 페이지로 리다이렉트
            isNotLoginSwal();
            navigate("/user/login");
        } else {
            getDefaultStoreList();
        }
    }, [navigate, userInfo]);

    // 가게 정보를 API로 받아서 state에 저장
    const getDefaultStoreList = () => {
        instance.get(`/store/getFavoriteStoreList?userId=${userInfo.id}`).then((res) => {
            console.log(res.data);
            setStoreData(res.data);
        });
    };

    // 즐겨찾기 등록 버튼 클릭 핸들러
    const favoriteClickHandler = (storeId) => {
        instance
            .post(`/favorite/insertFavorite`, {
                userId: userInfo.id,
                storeId: storeId,
            })
            .then(() => {
                setIsFavorite((prevFavorites) => ({
                    ...prevFavorites,
                    [storeId]: true,
                }));
            });
    };

    // 즐겨찾기 취소 버튼 클릭 핸들러
    const favoriteCancelClickHandler = (storeId) => {
        instance
            .post(`/favorite/checkFavoriteByUserStore`, {
                userId: userInfo.id,
                storeId: storeId,
            })
            .then((res) => {
                instance.delete(`/favorite/deleteFavoriteById?favoriteId=${res.data}`).then(() => {
                    setIsFavorite((prevFavorites) => ({
                        ...prevFavorites,
                        [storeId]: false,
                    }));
                });
            });
    };

    // 즐겨찾기 여부 확인
    const checkFavorite = () => {
        console.log(userInfo);
        instance.get(`/store/getFavoriteStoreList?userId=${userInfo.id}`).then((res) => {
            console.log(res.data);
            const favorites = res.data.reduce((acc, store) => {
                acc[store.storeId] = true;
                return acc;
            }, {});
            setIsFavorite(favorites); // 즐겨찾기 상태 업데이트
        });
    };

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
            const ratings = {};
            const reviewCounts = {};
    
            for (const store of storeData) {
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
            if (storeData.length > 0) {
                fetchRatingsAndReviews();
            }
        }, [storeData]);

    // 페이지 로드 시 사용자의 즐겨찾기 정보 불러오기
    useEffect(() => {
        if (userInfo.id) {
            checkFavorite(); // 사용자의 즐겨찾기 목록을 가져옵니다.
        }
    }, [userInfo.id]); // userInfo.id가 바뀔 때마다 실행

    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            // 로그인 안 되어 있으면 swal출력 후 로그인 페이지로 리다이렉트
            isNotLoginSwal();
            navigate("/user/login");
        }
    }, [navigate, userInfo]);

    return (
        <main>
            <ul className="storeList-card-list">
                {storeData.length === 0 ? (
                    <p>즐겨찾기한 가게가 없습니다.</p>
                ) : (
                    storeData.map((item) => (
                        <li key={item.storeId}>
                            <Card style={{ width: "18rem" }} className="storeList-card">
                                <Card.Body>
                                    <Link to={"/store/info"} state={item.storeId}>
                                        <Card.Img
                                            variant="top"
                                            src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                        />
                                        <Card.Title>{item.storeName}</Card.Title>
                                        <Card.Text>⭐{storeRatings[item.storeId] || 0}({storeReviewCounts[item.storeId] || 0}){" "}
                                        {item.identity}</Card.Text>
                                    </Link>
                                    {/* isFavorite 상태에 따라 버튼 변경 */}
                                    {isFavorite[item.storeId] ? (
                                        <Button onClick={() => favoriteCancelClickHandler(item.storeId)}>X</Button>
                                    ) : (
                                        <Button onClick={() => favoriteClickHandler(item.storeId)}>🔖</Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </li>
                    ))
                )}
            </ul>
        </main>
    );
};

export default FavoritePage;
