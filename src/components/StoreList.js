import instance from "../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const StoreList = () => {
  // 가게 정보를 저장하기 위한 state 선언
  const [storeData, setStoreData] = useState([]);

  // 가게 정보를 API로 받아서 state에 저장
  const getData = () => {
    instance.get("/store/list").then((res) => {
      //console.log(res.data);
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
            <Link to={"/store/info"} state={item.storeId}>
              <li key={item.storeId}>
                <Card style={{ width: "18rem" }}>
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{item.storeName}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              </li>
            </Link>
          );
        })}
      </ul>
      <h4>===============================</h4>
    </div>
  );
};
export default StoreList;
