import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Reserve from "../reserve/Reserve";
import SlideUpModal from "../../components/SlideUpModal"; // 모달 컴포넌트 import
import "../../css/Style.css"; // 슬라이드 업 패널 CSS import

const StoreList = () => {
    // 가게 정보를 저장하기 위한 state 선언
    const [storeData, setStoreData] = useState([]);

    // 예약 모달 상태 관리
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState(null); // 선택된 가게 ID

    // 가게 정보를 API로 받아서 state에 저장
    const getData = () => {
        instance.get("/store/list").then((res) => {
        setStoreData(res.data);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    // 예약 버튼 클릭 시 패널을 여는 함수
    const handleReserveClick = (storeId) => {
        setSelectedStoreId(storeId);
        setIsPanelOpen(true);
    };

    const [categoryList, setCategoryList] = useState([]);
        
    useEffect(() => {

    }, []);

    useEffect(() => {
        instance.get("/category/list").then((res) => {
            console.log(res.data);
            setCategoryList(res.data);
        })
    }, []);

    const categoryClickHandler = (categoryId) => {
        console.log(categoryId);
        instance.get(`/store/selectStoreByCategoryId?categoryId=${categoryId}`)
            .then((res) => {
            console.log(res.data);
            setStoreData(res.data);
        })
    }

return (
    <div>
        <h4>카테고리</h4>
        <button>전체</button>
        {categoryList.map((item) => (
            <button key={item.categoryId} onClick={() => categoryClickHandler(item.categoryId)}>{item.categoryTitle}</button>
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
    <SlideUpModal isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <Reserve
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        selectedStoreId={selectedStoreId}
        />
    </SlideUpModal>
    </div>
);
};

export default StoreList;
