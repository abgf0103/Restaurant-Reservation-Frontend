import React, { useState, useEffect } from "react";

// 즐겨찾기 페이지 컴포넌트
const FavoritePage = () => {
  // 즐겨찾기 목록 상태
  const [bookmarks, setBookmarks] = useState([]);
  // 새 즐겨찾기 항목을 위한 입력 상태
  const [bookmarkInput, setBookmarkInput] = useState("");

  // 페이지 로드 시 로컬 스토리지에서 즐겨찾기 목록을 불러옴
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, []);

  // 즐겨찾기 추가 함수
  const addBookmark = () => {
    if (!bookmarkInput.trim()) return; // 빈 입력 방지
    const newBookmark = bookmarkInput.trim();
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks)); // 로컬 스토리지에 저장
    setBookmarkInput(""); // 입력 폼 초기화
  };

  // 즐겨찾기 삭제 함수
  const deleteBookmark = (index) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks)); // 로컬 스토리지에 저장
  };

  return (
    <div>
      <h2>즐겨찾기 페이지</h2>

      {/* 즐겨찾기 입력 폼 */}
      <input
        type="text"
        value={bookmarkInput}
        onChange={(e) => setBookmarkInput(e.target.value)}
        placeholder="새 즐겨찾기를 입력하세요"
      />
      <button onClick={addBookmark}>추가</button>

      {/* 즐겨찾기 목록 */}
      <ul>
        {bookmarks.length === 0 ? (
          <li>즐겨찾기가 없습니다.</li>
        ) : (
          bookmarks.map((bookmark, index) => (
            <li key={index}>
              {bookmark}
              <button onClick={() => deleteBookmark(index)}>삭제</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FavoritePage;
