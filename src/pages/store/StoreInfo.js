import { Link, useLocation, useParams } from "react-router-dom";
import Reserve from "../user/Reserve";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import instance from "./../../api/api";

const StoreInfo = () => {
    const location = useLocation();

    const storeId = location.state;

    console.log(storeId);

    // 가게 정보를 저장하기 위한 state 선언
    const [storeData, setStoreData] = useState([]);

    // 가게 정보를 API로 받아서 state에 저장
    const getData = () => {
        instance.get(`/store/view/${storeId}`).then((res) => {
            console.log(res.data);
            setStoreData(res.data);
        });
    };

    console.log(storeData);

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <p>가게 정보</p>
            <h2>{storeData.storeName}</h2>
            <p>별점 : ? 리뷰개수, tel : {storeData.phone}</p>
            <p>{storeData.description}</p>
            <Link to="/review">리뷰작성 페이지</Link>



            <p>
                <Link to="/map">지도 화면</Link>
            </p>
            <p>{storeData.storeStatus}</p>
            <p>{storeData.storeHours}</p>
            <p>
                <Reserve />
            </p>


        </div>
    );
};
export default StoreInfo;
