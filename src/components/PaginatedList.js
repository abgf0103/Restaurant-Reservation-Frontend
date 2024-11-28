import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaginatedList = ({ items, itemsPerPage, renderItem }) => {
  const location = useLocation();

  // URL 파라미터에서 페이지 가져오기
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);

  // 페이지에 맞는 항목 추출
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 버튼 클릭 핸들러
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  return (
    <>
      {/* 현재 페이지의 항목들을 출력 */}
      {currentItems.map((item) => renderItem(item))}

      {/* 페이지네이션 버튼 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default PaginatedList;
