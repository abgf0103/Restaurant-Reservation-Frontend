import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../../css/Style.css";



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
        instance
        .get(`/store/selectStoreByCategoryId?categoryId=${categoryId}`)
        .then((res) => {
            setStoreData(res.data);
        });
    };

    useEffect(() => {
        // 페이지가 새로고침되면 result 초기화
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
        if(selectedCategoryId.length === 0){
            getDefaultStoreList();
        }
    },[selectedCategoryId]);

    useEffect(() => {
        if (result) {
            setStoreData(result);
        }
    }, [result]); // result가 변경될때마다 실행


    
    console.log(storeData);
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
                            <Card.Img variant="top" src="holder.js/100px180" />
                            <Card.Title>{item.storeName}</Card.Title>
                            <Card.Text>⭐4.5 (Identity)</Card.Text>
                        </Link>
                        <Button >🔖</Button>
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
