// 숫자에 3자리마다 쉼표 추가하는 함수
export const convertToWon = (num) => {
  if (num == null) return ''; // null 또는 undefined 처리
  return '₩' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};