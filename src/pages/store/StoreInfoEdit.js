import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';


const RegisterStore = () => {
    const navigate = useNavigate();
    const { storeId } = useParams(); // URL에서 storeId를 추출
    // 카테고리 리스트를 저장하기 위한 state 선언
    const [categoryList, setCategoryList] = useState([]);
    const [address, setAddress] = useState('');

    // 가게의 카테고리 정보를 가져오기
    const [categoryInfo, setCategoryInfo] = useState([]);

    const getCategoryInfo = () => {
        instance.get()
    }

    // 카테고리 리스트를 API로 받아서 state에 저장
    const getCategoryData = () => {
        instance.get("/category/list").then((res) => {
            setCategoryList(res.data);
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

    // 가게 정보 가져오기
    const [storeData, setStoreData] = useState([]);

    const getStoreData = () =>{
        instance.get(`/store/view/${storeId}`).then((res) => {
            setStoreData(res.data);
        });
    };
    console.log(storeData);

    useEffect(() => {
        getStoreData();
    }, []);


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



    const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        let localAddress = data.sido + ' ' + data.sigungu;

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress = fullAddress.replace(localAddress, '');
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
            console.log(fullAddress);
            storeData.address = fullAddress;
            setAddress(fullAddress);
        }

         // setAddress를 호출하여 부모 컴포넌트의 상태를 업데이트
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };
    //가게 수정 API 호출
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
                text: "가게 수정을 진행하려면 카테고리를 선택하세요.",
                icon: "warning",
            });
            return;
        }
        
        if(!isAgrre) {
            Swal.fire({
                title: "약관 확인",
                text: "가게 수정을 진행하려면 약관에 동의하세요.",
                icon: "warning",
            });
            return;
        }

        instance.post("/store/insert", {
            userId: userInfo.id,
            storeName: storeData.storeName,
            address: address,
            storeHours: storeData.storeHours,
            phone: storeData.phone,
            description: storeData.description,
        }).then(() => {
            Swal.fire({
                title: "성공",
                text: "가게 수정이 완료되었습니다.",
                icon: "success",
            });
            //storeName으로 storeId 찾아오기
            console.log(storeData.storeName);
            instance.get("/store/findStoreIdByStoreName", {
                params: {
                    storeName: storeData.storeName
                }
            }).then((res) => {
                //찾아온 id로 storeCategory 수정
                const storeId = res.data;
                console.log(storeId);
                instance.post("/storeCategory/save", {
                    storeId: storeId,
                    categoryId: storeCategory,
                }).then(() => {
                    navigate("/store/mystore"); // 내 가게 페이지로 이동
                })
                .catch((err) => {
                    console.error("storeCategory 수정 오류:", err);
                    Swal.fire({
                        title: "카테고리 오류",
                        text: "카테고리 수정에 오류가 발생했습니다. 나중에 다시 시도해주세요",
                        icon: "error",
                    });
                    return;
                });
            })
          }).catch((error) => {
            console.error("가게 수정 오류:", error);
            Swal.fire({
                title: "실패",
                text: "가게 수정에 실패했습니다.",
                icon: "error",
            });
        });
    };

    return (
        <div>
            <h2>가게 수정 페이지</h2>
            <Form onSubmit={requestStoreRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>가게 이름</Form.Label>
                    <Form.Control type="text" placeholder="가게 이름을 입력하세요" value={storeData.storeName} onChange={onChangeHandler} required/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>카테고리를 선택하세요</Form.Label>
                    <Form.Select name='category' onChange={storeCategoryHandler} value={storeCategory} required>
                        <option value="" hidden>카테고리를 선택하세요</option>
                        {categoryList.map((item) => {
                            return (       
                                // categoryList 저장된 DB에서 가져온 카테고리를 select option에 하나씩 추가
                                <option key={item.categoryId} value={item.categoryId}>{item.categoryTitle}</option>
                            );
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                        <Button variant="primary" type="button" onClick={handleClick}>
                        주소 검색
                        </Button>
                    {/* 주소입력 다음 api 추가해서 도로명 주소 받도록 */}
                    <Form.Control placeholder="주소를 입력하세요" value={storeData.address} onChange={onChangeHandler} required/>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>영업시간 (ex/17:00~23:00)</Form.Label>
                    <Form.Control placeholder="영업시간을 입력하세요" value={storeData.storeHours} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>연락처</Form.Label>
                    <Form.Control placeholder="연락처를 입력하세요" value={storeData.phone} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가게 소개</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="소개글을 입력하세요" value={storeData.description} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="약관에 동의합니다" onChange={isAgreeHandler} checked={isAgrre}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    가게 정보 수정
                </Button>
            </Form>
        </div>
    );
};
export default RegisterStore;
