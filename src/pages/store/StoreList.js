import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import SlideUpModal from "../../components/SlideUpModal";
import "../../css/Style.css";



const StoreList = () => {
    const location = useLocation();
    // 가게 정보를 저장하기 위한 state 선언
    const [storeData, setStoreData] = useState([]);
    // 카테고리 정보 state
    const [categoryList, setCategoryList] = useState([]);
    // 예약 모달 상태 관리
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState(null); // 선택된 가게 ID

    // 카테고리 상태 관리
    const [selectedCategoryId, setSelectedCategoryId] = useState([]);

    // 가게 검색 상태 관리
    const [result, setResult] = useState(null);
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

    // 예약 버튼 클릭 시 패널을 여는 함수
    const handleReserveClick = (storeId) => {
        setSelectedStoreId(storeId);
        setIsPanelOpen(true);
    };


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
                    <Link to={"/store/info"} state={item.storeId}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>{item.storeName}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                    </Card.Body>
                    </Link>
                    <button
                    className="reserve-button-list"
                    onClick={() => handleReserveClick(item.storeId)}
                    style={{ marginTop: "10px" }}
                    >
                    예약하기
                    </button>
                </Card>
                </li>
            );
            })}
        </ul>
        <h4>===============================</h4>

        {/* 슬라이드 업 예약 폼 모달 */}
        <SlideUpModal
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            selectedStoreId={selectedStoreId} // 올바르게 selectedStoreId 전달
        />
        </div>
    );
    };

    export default StoreList;
