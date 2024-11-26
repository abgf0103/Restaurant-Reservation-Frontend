// components/PaginatedList.js
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../pages/reserve/css/MyReserve.css";

const PaginatedList = ({ items, itemsPerPage = 10, renderItem }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // 현재 페이지에서 보여줄 항목 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 변경 함수
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* 현재 페이지의 항목들을 출력 */}
      <div>
        {currentItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {/* 페이지 버튼 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => goToPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginatedList;
