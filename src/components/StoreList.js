import instance from "../api/instance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StoreList = () => {
  const [storeData, setStoreData] = useState([]);

  const getData = () => {
    instance.get("/store/list").then((res) => {
      console.log(res.data);
      setStoreData(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h4>==========가게 정보 리스트==========</h4>
      <ul>
        {storeData.map((item) => {
          return (
            <li key={item.storeId}>
              <Link to={`/board/view/${item.id}`}>{item.storeName}</Link>
            </li>
          );
        })}
      </ul>
      <h4>===============================</h4>
    </div>
  );
};
export default StoreList;
