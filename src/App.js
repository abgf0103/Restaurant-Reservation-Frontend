import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/user/Login";
import NotFound from "./pages/error/NotFound";
import UnAuth from "./pages/error/UnAuth";
import RequireAuth from "./components/RequireAuth";
import Test from "./pages/test/Test";
import Review from "./pages/review/Review";

const ROLES = {
    ROLE_USER: 1,
    ROLE_ADMIN: 2,
    ROLE_SYSTEM: 3,
};

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/review" element={<Review />} />
                <Route path="/test" element={<Test />} />
                <Route path="/" element={<Landing />} />
                <Route path="/user/login" element={<Login />} />
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
