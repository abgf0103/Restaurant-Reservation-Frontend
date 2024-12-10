import React from 'react';
import Slider from 'react-slick';
import '../css/ImageSlider.css';
import ad1 from '../img/ad/ad1.PNG';
import ad2 from '../img/ad/ad2.PNG';
import ad3 from '../img/ad/ad3.PNG';
import { useNavigate } from 'react-router-dom';

const ImageSlider = () => {
    const navigate = useNavigate();
    const images = [
        ad1,
        ad2,
        ad3,
    ];
  
    // 슬라이드 설정
    const settings = {
      infinite: true, // 무한 반복
      speed: 500, // 슬라이드 전환 속도
      slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
      slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
      draggable: true, // 드래그 가능
      autoplay: true, // 자동 슬라이드
      autoplaySpeed: 3000, // 자동 슬라이드 속도 (3초마다)
      arrows: false, // 이전/다음 버튼 표시
      dots: true, // 하단에 점 표시
    };

    const goToEvent = () => {
        navigate('/event');
    }
    return (
      <div className='imgSlider' onClick={goToEvent}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                className='imgItem'
                src={image}
                alt={`slide ${index}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  
  export default ImageSlider;