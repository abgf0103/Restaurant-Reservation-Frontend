import { useState } from "react";
import instance from "../../api/instance";
const FileTest = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 첨부 완료된 결과 파일 목록
  const [fileList, setFileList] = useState([]);

  //파일 선택
  const handleFileChange = (e) => {
    console.log(e.target.files);
    setSelectedFiles((preState) => [
      ...preState,
      ...Array.from(e.target.files),
    ]);
  };

  //파일 업로드 액션
  const handleFileUpload = () => {
    console.log("파일 업로드");
    console.log(selectedFiles);
    // files,, fileTarget
    // api/file/save post
    const formData = new FormData();
    formData.append("fileTarget", "1234");

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    //selectedFiles.forEach(file => formData.append("files", file));

    instance
      .post("/file/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setFileList(res.data);
      });
  };

  const fileDelete = (id, fileTarget) => {
    //지울건지 물어보고 지우자
    //Swal

    //file/delete
    instance
      .post("/file/delete", {
        id: id,
        fileTarget: fileTarget,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const result = fileList.filter((item) => item.id !== id);
          setFileList(result);
        }
      });
  };

  return (
    <div>
      <h1>File Test Page</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="button" onClick={handleFileUpload}>
        업로드
      </button>
      <h2>파일 목록</h2>
      <ul>
        {fileList.map((item) => {
          return (
            <>
              <img
                //src={`${process.env.REACT_APP_HOST}/file/viewId/${item.saveFileName}`}
                src={`${process.env.REACT_APP_HOST}/file/viewId/${item.id}`}
                alt=""
                key={item.id}
                style={{ width: "100px" }}
              />
              <button
                type="button"
                onClick={() => fileDelete(item.id, item.fileTarget)}
              >
                삭제
              </button>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default FileTest;
