import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import SlideUpModal from "../../components/SlideUpModal";
import "../../css/Style.css";



const StoreList = ({searchKeyword}) => {
    // 가게 정보를 저장하기 위한 state 선언
    const [storeData, setStoreData] = useState([]);
    // 카테고리 정보 state
    const [categoryList, setCategoryList] = useState([]);
    // 예약 모달 상태 관리
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState(null); // 선택된 가게 ID

    // 가게 정보를 API로 받아서 state에 저장
    const getData = () => {
        instance.get("/store/list").then((res) => {
            setStoreData(res.data);
        });
    };

    // 키워드로 가게를 검색 후 가게 정보를 받아 state에 저장
    const searchResult = () => {
        if (searchKeyword){
            instance
                .get(`/store/search?searchKeyword=${searchKeyword}`)
                .then((res) => {
                    console.log(res.data);
                    setStoreData(res.data);
            });
        } else {
            getData();
        }

    };

    const getCategoryList = () => {
        instance.get("/category/list").then((res) => {
            setCategoryList(res.data);
        });
    };

    const categoryClickHandler = (categoryId) => {
        instance
        .get(`/store/selectStoreByCategoryId?categoryId=${categoryId}`)
        .then((res) => {
            setStoreData(res.data);
        });
    };

    useEffect(() => {
        getCategoryList();
    }, []); //빈 배열로 한번만 실행되도록 설정


    useEffect(() => {
        //검색어가 변경될때마다 키워드 검색결과 호출
        if (searchKeyword) {
            searchResult();
        } else {
            // 검색어가 없으면 모든 데이터 가져오기
            getData();
        }
    }, [searchKeyword]); //키워드가 변경될때마다 실행

    // 예약 버튼 클릭 시 패널을 여는 함수
    const handleReserveClick = (storeId) => {
        setSelectedStoreId(storeId);
        setIsPanelOpen(true);
    };




    return (
        <div>
        <h4>카테고리</h4>
        <button onClick={() => getData()}>전체</button>
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
