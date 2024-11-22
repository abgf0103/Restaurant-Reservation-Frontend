import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../../css/Style.css";
import { getUserInfo } from "../../hooks/userSlice";
import { useSelector } from "react-redux";

const StoreList = () => {
    const location = useLocation();
    // 가게 정보를 저장하기 위한 state 선언
    const [storeData, setStoreData] = useState([]);
    // 카테고리 정보 state
    const [categoryList, setCategoryList] = useState([]);

    // 카테고리 상태 관리
    const [selectedCategoryId, setSelectedCategoryId] = useState([]);

    // 가게 검색 상태 관리
    const [result, setResult] = useState(null);

    // 로그인된 사용자 정보
    const userInfo = useSelector(getUserInfo);

    // 북마크 여부
    const [isFavorite, setIsFavorite] = useState(false);

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
            userId: userInfo.username,
            storeId: storeId,
        }).then(() => {
            // 즐겨찾기 등록 후 UI에 반영
            setIsFavorite((prevFavorites) => ({
                ...prevFavorites,
                [storeId]: true, // 해당 storeId를 즐겨찾기 상태로 설정
            }));
        });
    };


    // 즐겨찾기 취소 버튼 클릭 핸들러
    const favoriteCancelClickHandler = (storeId) => {
        //  /api/favorite/deleteFavoriteById로 삭제
        instance.post(`/favorite/checkFavoriteByUserStore`,{
            userId: userInfo.username,
            storeId: storeId,
        }).then((res)=> {
            console.log(res.data);
            instance.delete(`/favorite/deleteFavoriteById?favoriteId=${res.data}`)
            .then(() => {
                // 즐겨찾기 취소 후 UI에 반영
                setIsFavorite((prevFavorites) => ({
                    ...prevFavorites,
                    [storeId]: false, // 해당 storeId를 즐겨찾기 취소 상태로 설정
                }));
            });
        })
    };

    // 즐겨찾기 여부 
    const checkFavorite = (storeId) => {
        instance.post(`/favorite/checkFavoriteByUserStore`,{
                userId: userInfo.username,
                storeId: storeId,
            }
        ).then((res)=> {
            // 즐겨찾기 여부에 따라 상태 업데이트
            setIsFavorite((prevFavorites) => ({
                ...prevFavorites,
                [storeId]: res.data, // 서버의 응답에 따라 true/false 저장
            }));
        })

    }

    useEffect(() => {
        setResult(null);

        // `state`로 전달된 결과가 있다면 상태를 설정
        if (location.state?.result) {
        setResult(location.state.result);
        }
    }, [location.state]); // location.state가 변경될 때마다 실행

    useEffect(() => {
        // 페이지 새로고침 시 상태를 초기화하고, 이전 상태를 유지하지 않도록 처리
        setResult(null);
        getCategoryList();
        getDefaultStoreList();
    }, []); // 빈 배열로 한번만 실행

    // 카테고리가 변경될때
    useEffect(() => {
        if (selectedCategoryId.length === 0) {
            getDefaultStoreList();
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (result) {
            setStoreData(result);
        }
    }, [result]); // result가 변경될때마다 실행

        // storeData가 변경될 때마다 checkFavorite 호출
        useEffect(() => {
            storeData.forEach(item => {
                checkFavorite(item.storeId);  // 각 storeId에 대해 즐겨찾기 여부 확인
            });
        }, [storeData]);

    return (
        <div>
        <h4>카테고리</h4>
        <button onClick={() => getDefaultStoreList()}>전체</button>
        {categoryList.map((item) => (
            <button
            key={item.categoryId}
            onClick={() => categoryClickHandler(item.categoryId)}
            >
            {item.categoryTitle}
            </button>
        ))}
        <h4>==========가게 정보 리스트==========</h4>
        <ul>
            {storeData.map((item) => {

            return (
                <li key={item.storeId}>
                <Card style={{ width: "18rem" }}>
                    <Card.Body>
                    <Link to={"/store/info"} state={item.storeId}>
                        <Card.Img
                        variant="top"
                        src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                        />
                        <Card.Title>{item.storeName}</Card.Title>
                        <Card.Text>⭐4.5 (Identity)</Card.Text>
                    </Link>
                    {/* isFavorite = true면 버튼 다르게 */}
                    {isFavorite[item.storeId] ? (
                        <Button
                        onClick={() => favoriteCancelClickHandler(item.storeId)}
                        >
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
            );
            })}
        </ul>
        <h4>===============================</h4>
        </div>
    );
};

export default StoreList;
