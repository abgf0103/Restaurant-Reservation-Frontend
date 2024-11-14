import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';


const RegisterStore = () => {
    const navigate = useNavigate();

    // 카테고리를 저장하기 위한 state 선언
    const [categoryData, setCategory] = useState([]);

    // 카테고리 정보를 API로 받아서 state에 저장
    const getCategoryData = () => {
        instance.get("/category/list").then((res) => {
            setCategory(res.data);
        });
    };

    useEffect(() => {
        getCategoryData();
    }, []);

    //유저정보 가져오기
    const [userInfo, setUserInfo] = useState('');
    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);

    const [storeData, setStoreData] = useState([]);

    // 가게 정보를 입력할때마다 이벤트를 발생시켜 값을 저장
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setStoreData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    }

    const [isAgrre, setIsAgree] = useState(false);

    const isAgreeHandler = (e) => {
        setIsAgree(e.target.checked);
    }


    const [storeCategory, setStoreCategory] = useState();

    const storeCategoryHandler = (e) => {
        setStoreCategory(e.target.value);
    }

    //가게 등록 API 호출
    const requestStoreRegister = (e) => {
        e.preventDefault();

        //가게 이름 체크 "/store/hasStoreName"
        instance.get("/store/hasStoreName", {
            params: {
                storeName: storeData.storeName,
            },
        }).then((res) => {
            if(res.data){
                Swal.fire({
                    title: "가게 이름 중복",
                    text: "동일한 가게 이름이 존재합니다.",
                    icon: "error",
                });
                return;
            }
        })

        console.log(storeCategory);
        console.log(storeData);

        if(storeCategory === undefined){
            Swal.fire({
                title: "카테고리 선택",
                text: "가게 등록을 진행하려면 카테고리를 선택하세요.",
                icon: "warning",
            });
            return;
        }
        
        if(!isAgrre) {
            Swal.fire({
                title: "약관 확인",
                text: "가게 등록을 진행하려면 약관에 동의하세요.",
                icon: "warning",
            });
            return;
        }



        instance.post("/store/insert", {
            userId: userInfo.id,
            storeName: storeData.storeName,
            address: storeData.address,
            storeHours: storeData.storeHours,
            phone: storeData.phone,
            description: storeData.description,
        }).then(() => {
            Swal.fire({
                title: "성공",
                text: "가게 등록이 완료되었습니다.",
                icon: "success",
            });
            //storeName으로 storeId 찾아오기
            console.log(storeData.storeName);
            instance.get("/store/findStoreIdByStoreName", {
                params: {
                    storeName: storeData.storeName
                }
            }).then((res) => {
                //찾아온 id로 storeCategory 등록
                const storeId = res.data;
                console.log(storeId);
                instance.post("/storeCategory/save", {
                    storeId: storeId,
                    categoryId: storeCategory,
                }).then(() => {
                    navigate("/store/mystore"); // 내 가게 페이지로 이동
                })
                .catch((err) => {
                    console.error("storeCategory 등록 오류:", err);
                    Swal.fire({
                        title: "카테고리 오류",
                        text: "카테고리 등록에 오류가 발생했습니다. 나중에 다시 시도해주세요",
                        icon: "error",
                    });
                    return;
                });
            })
          }).catch((error) => {
            console.error("가게 등록 오류:", error);
            Swal.fire({
                title: "실패",
                text: "가게 등록에 실패했습니다.",
                icon: "error",
            });
        });
    };

    return (
        <div>
            <h2>가게 등록 페이지</h2>
            <Form onSubmit={requestStoreRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>가게 이름</Form.Label>
                    <Form.Control type="text" placeholder="가게 이름을 입력하세요" name='storeName' onChange={onChangeHandler} required/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>카테고리를 선택하세요</Form.Label>
                    <Form.Select name='category' onChange={storeCategoryHandler} value={storeCategory} required>
                        <option value="" hidden>카테고리를 선택하세요</option>
                        {categoryData.map((item) => {
                            return (       
                                // categoryData에 저장된 DB에서 가져온 카테고리를 select option에 하나씩 추가
                                <option key={item.categoryId} value={item.categoryId}>{item.categoryTitle}</option>
                            );
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>주소</Form.Label>
                    {/* 주소입력 다음 api 추가해서 도로명 주소 받도록 */}
                    <Form.Control placeholder="주소를 입력하세요" name='address'onChange={onChangeHandler} required/>
                </Form.Group>

                <DaumPostcode
                ></DaumPostcode>

                <Form.Group className="mb-3">
                    <Form.Label>영업시간 (ex/17:00~23:00)</Form.Label>
                    <Form.Control placeholder="영업시간을 입력하세요" name='storeHours'onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>연락처</Form.Label>
                    <Form.Control placeholder="연락처를 입력하세요" name='phone'onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가게 소개</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="소개글을 입력하세요" name='description' onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="약관에 동의합니다" onChange={isAgreeHandler} checked={isAgrre}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    등록 요청
                </Button>
            </Form>
        </div>
    );
};
export default RegisterStore;
