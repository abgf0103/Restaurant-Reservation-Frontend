import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
    const userInfo = useSelector(getUserInfo);
    const location = useLocation();

    // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
    if (!userInfo?.username) {
        return <Navigate to="/user/login" state={{ from: location }} replace />;
    }

    // 사용자가 허용된 역할이 있을 경우만 Outlet을 렌더링
    return (allowedRoles ? allowedRoles.includes(userInfo.roles) || userInfo.roles === "admin" : true) ? (
        // roles 검사를 하지 않으면 모든 로그인된 사용자는 접근 가능
        <Outlet />
    ) : (
        <Navigate to="/unauth" replace />
    );
};

export default RequireAuth;
