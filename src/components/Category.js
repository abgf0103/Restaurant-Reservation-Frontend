import instance from "../api/instance";
import { useEffect, useState } from 'react';

const Category = () => {
    const [categoryList, setCategoryList] = useState([]);
    
    useEffect(() => {

    }, []);

    // useEffect(() => {
    //     instance.get("/category/list").then((res) => {
    //         console.log(res.data);
    //         setCategoryList(res.data);
    //     }
    // })


    // )
    return (
        <div>
            <h4>카테고리</h4>
            {categoryList.map((item) => (
                        <button>{item.categoryTitle}</button>
                    ))}
        </div>
    );
  };
  export default Category;
  