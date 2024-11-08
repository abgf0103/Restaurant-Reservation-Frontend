import { Link } from "react-router-dom";
import instance from "../../api/api";
import { useEffect, useState } from "react";

const Test = () => {
  const [data, setData] = useState([]);

  const getData = () => {
    instance.get("/cmmn/findAll").then((res) => {
      console.log(res);
      setData(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <ul>
        {data.map((item) => {
          return (
            <li key={item.id}>
              <Link to="">{item.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Test;
