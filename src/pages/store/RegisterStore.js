import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';

const RegisterStore = () => {

    // 카테고리를 저장하기 위한 state 선언
    const [categoryData, setCategory] = useState([]);

    // 카테고리 정보를 API로 받아서 state에 저장
    const getData = () => {
        instance.get("/category/list").then((res) => {
            console.log(res.data);
            setCategory(res.data);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    //유저정보 가져오기
    const [userInfo, setUserInfo] = useState('');
    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);
    console.log(userInfo);
    // 가게 등록 API 호출
    const registerStore = () => {
        const body = {
            storeName: '가게이름',
            categoryId: 1,
            address: '주소',
            businessHours: '영업시간',
            contact: '연���처',
            userId: userInfo.userId,
        };
        instance.post("/store/register", body).then((res) => {
            console.log(res.data);
        });
    };

    return (
        <div>
            <h2>가게 등록 페이지</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>가게 이름</Form.Label>
                    <Form.Control type="email" placeholder="가게 이름을 입력하세요" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>카테고리를 선택하세요</Form.Label>
                    <Form.Select>
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
                    <Form.Control placeholder="주소를 입력하세요" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>영업시간</Form.Label>
                    <Form.Control placeholder="영업시간을 입력하세요" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>연락처</Form.Label>
                    <Form.Control placeholder="연락처를 입력하세요" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가게 소개</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="소개글을 입력하세요" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="약관에 동의합니다" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    등록 요청
                </Button>
            </Form>
        </div>
    );
};
export default RegisterStore;
