import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../hooks/tokenSlice";
import { getUserInfo } from "../hooks/userSlice";
import { Link } from "react-router-dom";
import StoreList from "./../components/StoreList";

const Landing = () => {
    // redux 저장소에 저장된 토큰 정보 호출
    const tokenInfo = useSelector(getTokenInfo);
    const userInfo = useSelector(getUserInfo);

    console.table(tokenInfo);
    console.log(userInfo);

    useEffect(() => {
        // console.table(tokenInfo);
        // session storage : 휘발성, 브라우저를 닫으면 삭제된다.
        // sessionStorage.setItem("sessionTest", "세션테스트");
        // const data = sessionStorage.getItem("sessionTest");
        // console.log(data);
        // local storage : 비휘발성, 브라우저를 닫아도 데이터가 유지된다.
        // 데이터 저장 : localStorage.setItem(키, 벨류)
        // 데이터 호출 : localStorage.getItem(키)
        // 데이터 삭제 : localStorage.removeItem(키 )
        // localStorage.setItem("test", "테스트");
        // const data = localStorage.getItem("test");
        // console.log(data);
    }, []);

    // const eventSourceRef = useRef(null);
    // const [listening, setListening] = useState(false);
    // const setupEventSource = () => {
    //   eventSourceRef.current = new EventSource(
    //     `${process.env.REACT_APP_HOST}/review/save`
    //   );
    //   eventSourceRef.current.onopen = (e) => {
    //     console.log("메시지를 받았다.");
    //     console.log(e);
    //   };
    //   eventSourceRef.current.error = (e) => {
    //     console.log("error");
    //     console.log(e);
    //     eventSourceRef.current?.close();
    //   };
    //   eventSourceRef.current?.close();

    //   setListening(true);

    //   return () => {
    //     eventSourceRef.current?.close();
    //   };
    // };
    // useEffect(() => {
    //   setupEventSource();
    //   if (!listening) setupEventSource();
    // }, []);

    return (
        <>
            <div>
                <h2>Landing page</h2>
                <StoreList />
                <p>
                    <Link to="/user/search">검색결과 페이지</Link>
                </p>

                <p>
                    <Link to="/store/info">가게 정보 페이지</Link>
                </p>
                <p>
                    <Link to="/review/list">전체 리뷰 페이지</Link>
                </p>
                <p>
                    <Link to="/review">리뷰작성 페이지</Link>
                </p>
            </div>
        </>
    );
};

export default Landing;
