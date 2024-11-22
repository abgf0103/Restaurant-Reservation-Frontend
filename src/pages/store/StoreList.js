import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../../css/Style.css";
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

    const [avgRating, setAvgRating] = useState([]); // 가게 평균 별점 상태관리

    // 가게 평균 별점 조회
    const getRatingAvgByStoreId = (storeId) => {
      instance
       .get(`/review/getRatingAvgByStoreId?storeId=${storeId}`)
       .then((res) => {
          setAvgRating(res.data);
        });
    }

    // 가게 정보를 API로 받아서 state에 저장
    const getDefaultStoreList = () => {
        instance.get("/store/list").then((res) => {
            console.log(res.data);
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
        instance
        .get(`/store/selectStoreByCategoryId?categoryId=${categoryId}`)
        .then((res) => {
            setStoreData(res.data);
        });
    };

    // 즐겨찾기 등록 버튼 클릭 핸들러
    const favoriteClickHandler = (storeId) => {
        instance.post(`/favorite/insertFavorite`, {
            userId: userInfo.id,
            storeId: storeId,
        }).then(() => {
            setIsFavorite((prevFavorites) => ({
                ...prevFavorites,
                [storeId]: true,
            }));
        });
    };

    // 즐겨찾기 취소 버튼 클릭 핸들러
    const favoriteCancelClickHandler = (storeId) => {
        instance.post(`/favorite/checkFavoriteByUserStore`, {
            userId: userInfo.id,
            storeId: storeId,
        }).then((res) => {
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
        instance.get(`/store/getFavoriteStoreList?userId=${userInfo.id}`)
        .then((res) => {
            console.log(res.data);
            const favorites = res.data.reduce((acc, store) => {
                acc[store.storeId] = true;
                return acc;
            }, {});
            setIsFavorite(favorites); // 즐겨찾기 상태 업데이트
        });
    };

    useEffect(() => {
        setResult(null);
        if (location.state?.result) {
            setResult(location.state.result);
        }
    }, [location.state]);

    useEffect(() => {
        setResult(null);
        getCategoryList();
        getDefaultStoreList();
    }, []);

    useEffect(() => {
        if (selectedCategoryId.length === 0) {
            getDefaultStoreList();
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (result) {
            setStoreData(result);
        }
    }, [result]);

    // 페이지 로드 시 사용자의 즐겨찾기 정보 불러오기
    useEffect(() => {
        if (userInfo.id) {
            checkFavorite(); // 사용자의 즐겨찾기 목록을 가져옵니다.
        }
    }, [userInfo.id]); // userInfo.id가 바뀔 때마다 실행




    return (
        <div>
            <h4>카테고리</h4>
            <button onClick={() => getDefaultStoreList()}>전체</button>
            {categoryList.map((item) => (
                <button key={item.categoryId} onClick={() => categoryClickHandler(item.categoryId)}>
                    {item.categoryTitle}
                </button>
            ))}
            <h4>==========가게 정보 리스트==========</h4>
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
                                    <Card.Text>⭐{} (Identity)</Card.Text>
                                </Link>
                                {/* isFavorite 상태에 따라 버튼 변경 */}
                                {isFavorite[item.storeId] ? (
                                    <Button onClick={() => favoriteCancelClickHandler(item.storeId)}>
                                        X
                                    </Button>
                                ) : (
                                    <Button onClick={() => favoriteClickHandler(item.storeId)}>
                                        🔖
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </li>
                ))}
            </ul>
            <h4>===============================</h4>
        </div>
    );
};

export default StoreList;
