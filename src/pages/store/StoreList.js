import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../reserve/css/reserve.css";
import { getUserInfo } from "../../hooks/userSlice";
import { useSelector } from "react-redux";

const StoreList = () => {
    const location = useLocation();
    const [storeData, setStoreData] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState([]);
    const [result, setResult] = useState(null);
    const userInfo = useSelector(getUserInfo);
    const [isFavorite, setIsFavorite] = useState({});

    const [storeRatings, setStoreRatings] = useState({}); // 각 가게의 평점 저장
    const [storeReviewCounts, setStoreReviewCounts] = useState({}); // 각 가게의 리뷰 수 저장

    // 가게 정보를 API로 받아서 state에 저장
    const getDefaultStoreList = () => {
        instance.get("/store/list").then((res) => {
            setStoreData(res.data);
        });
    };

    // 카테고리 리스트를 가져와 state에 저장
    const getCategoryList = () => {
        instance.get("/category/list").then((res) => {
            setCategoryList(res.data);
        });
    };

    // 카테고리 버튼 클릭 핸들러
    const categoryClickHandler = (categoryId) => {
        setSelectedCategoryId(categoryId);
        instance.get(`/store/selectStoreByCategoryId?categoryId=${categoryId}`).then((res) => {
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
        instance.get(`/store/getFavoriteStoreList?userId=${userInfo.id}`).then((res) => {
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

    // 페이지 로드 시 사용자의 즐겨찾기 정보 불러오기
    useEffect(() => {
        if (userInfo.id) {
            checkFavorite(); // 사용자의 즐겨찾기 목록을 가져옵니다.
        }
    }, [userInfo.id]);

    // storeData가 업데이트 될 때마다 평점과 리뷰 수 가져오기
    useEffect(() => {
        if (storeData.length > 0) {
            fetchRatingsAndReviews();
        }
    }, [storeData]);

    // 검색 결과 상태 처리
    useEffect(() => {
        setResult(null);
        if (location.state?.result) {
            setResult(location.state.result);
        }
    }, [location.state]);

    // 기본 가게 리스트 및 카테고리 목록 가져오기
    useEffect(() => {
        getCategoryList();
        getDefaultStoreList();
    }, []);

    // 카테고리 선택 시 가게 리스트 업데이트
    useEffect(() => {
        if (selectedCategoryId.length === 0) {
            getDefaultStoreList();
        }
    }, [selectedCategoryId]);

    // 검색 결과가 있으면 업데이트
    useEffect(() => {
        if (result) {
            setStoreData(result);
        }
    }, [result]);

    return (
        <div>
            <button onClick={() => getDefaultStoreList()}>전체</button>
            {categoryList.map((item) => (
                <button key={item.categoryId} onClick={() => categoryClickHandler(item.categoryId)}>
                    {item.categoryTitle}
                </button>
            ))}
            <ul>
                {storeData.map((item) => (
                    <li key={item.storeId}>
                        <Card style={{ width: "18rem" }}>
                            <Card.Body>
                                <Link to={"/store/info"} state={item.storeId}>
                                    <Card.Img
                                        variant="top"
                                        src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                    />
                                    <Card.Title>{item.storeName}</Card.Title>
                                    <Card.Text>
                                        ⭐{storeRatings[item.storeId] || 0}({storeReviewCounts[item.storeId] || 0}){" "}
                                        {item.identity}
                                    </Card.Text>
                                </Link>
                                {isFavorite[item.storeId] ? (
                                    <Button onClick={() => favoriteCancelClickHandler(item.storeId)}>X</Button>
                                ) : (
                                    <Button onClick={() => favoriteClickHandler(item.storeId)}>🔖</Button>
                                )}
                            </Card.Body>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StoreList;
