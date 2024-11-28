import { useEffect} from "react";
import { useLocation } from "react-router-dom";
import StoreList from './pages/store/StoreList';
import ImageSlider from "./components/ImageSlider";
import './css/Landing.css';

const Landing = () => {
    // redux 저장소에 저장된 토큰 정보 호출
    //const tokenInfo = useSelector(getTokenInfo);
    //const userInfo = useSelector(getUserInfo);

    //console.table(tokenInfo);
    //console.log(userInfo);

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

    const location = useLocation();
    //검색어가 전달되지 않으면 빈 문자열
    const searchKeyword = location.state?.searchKeyword || ''; 

    return (
            <main className="landingContainer">
                <ImageSlider/>
                <StoreList searchKeyword={searchKeyword}/>
            </main>
    );
};

export default Landing;
