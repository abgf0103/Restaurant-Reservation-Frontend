import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import instance from './../../api/instance';
import { useSelector } from 'react-redux';
import { getUserInfo } from './../../hooks/userSlice';
import { useEffect } from 'react';
import { isNotLoginSwal } from "../../utils/tools";
const Mypage = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    // 로그인 상태 체크
    useEffect(() => {
        if (!userInfo.username) {
            isNotLoginSwal();
            navigate("/user/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
        }
    }, [navigate, userInfo]);

    const [isAdmin, setIsAdmin] = useState(false);

    if (userInfo.id){
        instance.get(`/user/isAdminByUserId?userId=${userInfo.id}`)
        .then((res) =>{
            if(res.data === 3){
                setIsAdmin(true);
            }
        })
    }

    console.log(isAdmin);

    return (
        <div>
        <h2>마이 페이지</h2>
        <p>
            <Link to="/user/CheckUserEdit">회원수정 페이지</Link>
        </p>
        <p>
            <Link to="/review/myreview">나의 리뷰 페이지</Link>
        </p>
        <p>
            <Link to="/user/myreserve">나의 예약 페이지</Link>
        </p>
        <p>
            <Link to="/user/deleteUser">회원 삭제</Link>
        </p>
        {/* 어드민만 보이는 페이지*/}
        {isAdmin &&         
            <p>
                <Link to="/user/deleteUser">어드민 페이지</Link>
            </p>}
        </div>
    );
};
export default Mypage;
