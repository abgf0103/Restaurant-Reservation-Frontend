import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/user/Login";
import NotFound from "./pages/error/NotFound";
import UnAuth from "./pages/error/UnAuth";
import RequireAuth from "./components/RequireAuth";
import Test from "./pages/test/Test";
import Review from "./pages/review/Review";
import Signup from "./pages/user/Signup";
import Search from "./pages/user/Search";
import Reserve from "./pages/user/Reserve";
import StoreInfo from "./pages/store/StoreInfo";
import StoreInfoEdit from "./pages/store/StoreInfoEdit";
import ReviewEdit from "./pages/review/ReviewEdit";
import ReviewList from "./pages/review/ReviewList";
import UserEdit from "./pages/user/UserEdit";
import Mypage from "./pages/user/Mypage";
import Map from "./pages/user/Map";
import StoreSearch from "./pages/store/StoreSearch";
import MyReview from "./pages/review/MyReview";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getUserInfo, removeUserInfo } from "./hooks/userSlice";
import { removeTokenInfo } from "./hooks/tokenSlice";

const ROLES = {
    ROLE_USER: 1,
    ROLE_ADMIN: 2,
    ROLE_SYSTEM: 3,
};

function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector(getUserInfo); // Redux에서 로그인된 사용자 정보 가져오기

    // 로그아웃 처리
    const handleLogout = () => {
        // 로컬스토리지에서 로그인 정보 및 토큰 삭제
        localStorage.removeItem("tokenInfo");
        localStorage.removeItem("userInfo");

        // Redux 상태 초기화
        dispatch(removeUserInfo());
        dispatch(removeTokenInfo());

        // 메인 페이지로 리다이렉트
        navigate("/");
    };

    return (
        <AppLayout>
            <Routes>
                <Route path="/review" element={<Review />} />
                <Route path="/review/list" element={<ReviewList />} />
                <Route path="/review/edit" element={<ReviewEdit />} />
                <Route path="/review/myreview" element={<MyReview />} />

                <Route path="/user/login" element={<Login />} />
                <Route path="/user/signup" element={<Signup />} />
                <Route path="/user/edit" element={<UserEdit />} />
                <Route path="/user/mypage" element={<Mypage />} />

                <Route path="/user/search" element={<Search />} />

                <Route path="/user/reserve" element={<Reserve />} />

                <Route path="/store/info" element={<StoreInfo />} />
                <Route path="/store/edit" element={<StoreInfoEdit />} />
                <Route path="/store/search" element={<StoreSearch />} />
                <Route path="/map" element={<Map />} />

                <Route path="/test" element={<Test />} />
                <Route path="/" element={<Landing />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/unauth" element={<UnAuth />} />
                <Route path="/admin" element={<RequireAuth allowedRoles={[ROLES.ROLE_SYSTEM, ROLES.ROLE_ADMIN]} />}>
                    <Route path="/admin/board" element={<div>board</div>} />
                </Route>
            </Routes>
        </AppLayout>
    );
}

export default App;
