import instance from './../../api/instance';
import {useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const StoreReserve = () => {
    const { storeId } = useParams(); // URL에서 storeId를 추출   
    
    // 가게 정보 가져오기
    const [storeData, setStoreData] = useState({
        storeHours: '',
        phone: '',
        description: '',
    });
    console.log(storeData);

    console.log(storeId);

    // 로그인 상태 체크
    useEffect(() => {
        instance.get(`/store/view/${storeId}`)
        .then((res) => {
            console.log(res.data);
            setStoreData(res.data);
        })
    }, []);

    console.log(storeData);
    return (
        <div>
            <h2>가게의 예약 조회 페이지</h2>

            <h4>{storeData.storeName}</h4>
        </div>
    );
  };
  export default StoreReserve;
  