import React from 'react';
import Slider from 'react-slick';
import '../css/Style.css';

const ImageSlider = () => {
    const images = [
      'https://via.placeholder.com/600x300/ff7f7f/333333?text=Image+1',
      'https://via.placeholder.com/600x300/7fffd4/333333?text=Image+2',
      'https://via.placeholder.com/600x300/7f7fff/333333?text=Image+3',
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
  
    return (
      <div style={{ width: '600px', margin: '0 auto' }}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`slide ${index}`}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  
  export default ImageSlider;