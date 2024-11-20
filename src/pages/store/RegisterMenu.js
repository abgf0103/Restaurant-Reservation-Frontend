import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';


const RegisterMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.state.storeId;

    //유저정보 가져오기
    const [userInfo, setUserInfo] = useState('');
    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);

    // 로그인 상태 체크
    // useEffect(() => {
    //     if (!userInfo.username) {
    //     // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    //     navigate("/user/login");
    //     }
    // }, [navigate, userInfo]);

    // 메뉴 정보 가져오기
    const [menuData, setMenuData] = useState({
        menuName: '',
        description: '',
        price: '',
    });

    // 메뉴 정보를 입력할때마다 이벤트를 발생시켜 값을 저장
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setMenuData((prevState) => ({
          ...prevState,
          [name]: value,
        }));

    }

    //가게 수정 API 호출
    const requestMenuRegister = (e) => {
        e.preventDefault();
        
        instance.post("/store/menu/insert", {
            storeId: storeId,
            menuName: menuData.menuName,
            description: menuData.description,
            price: menuData.price,
        }).then(() => {
            Swal.fire({
                title: "성공",
                text: "가게 등록이 완료되었습니다.",
                icon: "success",
            });
            navigate(`/store/menu/management/${storeId}`); // 메뉴 관리 페이지로 이동
          }).catch((error) => {
            console.error("가게 등록 오류:", error);
            Swal.fire({
                title: "실패",
                text: "가게 등록에 실패했습니다.",
                icon: "error",
            });
        });
    };
    console.log()


    return (
        <div>
            <h2>메뉴 추가</h2>
            <Form onSubmit={requestMenuRegister}>

                <Form.Group className="mb-3">
                    <Form.Label>메뉴 이름</Form.Label>
                    <Form.Control placeholder="메뉴 이름을 입력하세요" name='menuName' value={menuData.menuName} onChange={onChangeHandler} required/>
                </Form.Group>

                <h3>메뉴 이미지 선택</h3>
                <input type="file"/>
                <img src="" alt="" />

                <Form.Group className="mb-3">
                    <Form.Label>메뉴 설명</Form.Label>
                    <Form.Control placeholder="메뉴 설명을 입력하세요" name='description' value={menuData.description} onChange={onChangeHandler} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가격을 설정하세요</Form.Label>
                    <Form.Control type='number' name='price' placeholder="가격을 설정하세요" value={menuData.price} onChange={onChangeHandler} required/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    메뉴 추가
                </Button>
            </Form>
        </div>
        
    );
};
export default RegisterMenu;
