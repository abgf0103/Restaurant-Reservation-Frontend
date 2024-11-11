import instance from "../api/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StoreList = () => {
    // const [data, setData] = useState([]);

    // const getData = () => {
    //     instance.get("/api/store/list").then((res) => {
    //         console.log(res.data);
    //         setData(res.data);
    //     });
    // };

    // useEffect(() => {
    //     getData();
    // }, []);

    return (
        <div>
            {/* <h4>==========가게 정보 리스트==========</h4>
            <ul>
                {data.map((item) => {
                    // return (
                    //     <li key={item.id}>
                    //         <Link to={`/board/view/${item.id}`}>{item.title}</Link>
                    //     </li>
                    // );
                })}
            </ul>
            <h4>===============================</h4> */}
        </div>
    );
};
export default StoreList;
