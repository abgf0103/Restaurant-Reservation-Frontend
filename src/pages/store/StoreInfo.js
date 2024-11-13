import { Link, useLocation } from "react-router-dom";
import Reserve from "../reserve/Reserve";
import { useSelector } from "react-redux";
import instance from "../../api/instance";
import { useEffect, useState } from "react";

const StoreInfo = () => {
  const location = useLocation();

  // 현재 storeId를 location state에서 가져옴
  const storeId = location.state;

  // 가게 정보를 저장하기 위한 state 선언
  const [storeData, setStoreData] = useState([]);

  // 가게 정보를 API로 받아서 state에 저장
  const getData = () => {
    instance.get(`/store/view/${storeId}`).then((res) => {
      setStoreData(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, [storeId]); // storeId가 변경될 때마다 데이터 재요청

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>별점 : ? 리뷰개수, tel : {storeData.phone}</p>
      <p>{storeData.description}</p>

      {/* storeId를 URL 파라미터로 전달하는 방식으로 Link 수정 */}
      <Link to={`/writeReview/${storeId}`}>리뷰작성 페이지</Link>

      <p>
        <Link to="/map">지도 화면</Link>
      </p>
      <p>{storeData.storeStatus}</p>
      <p>{storeData.storeHours}</p>
      <Reserve />
    </>
  );
};

export default StoreInfo;
