import { useState } from 'react';
import styled from 'styled-components';
import api from '../api/api';

const ImageUploader = styled.input.attrs({
  type: 'file',
  accept: '.jpg,.jpeg,.png',
})``;

const ImagePage = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const handleUpload = async () => {
    if (file) {
      const presignedURL = await api.createUpload(file.name);
      const success = await api.uploadStorageService(presignedURL, file);
      console.log(`Upload ${file.name} ${success}`);
      console.log(file.type);
    }
  };

  return (
    <>
      <h1>發表一篇圖文</h1>
      <div>
        <span>請輸入文字: </span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
      </div>
      <div>
        <span>請選擇檔案: </span>
        <ImageUploader onChange={(e) => setFile(e.target.files?.[0])} />
      </div>
      <button onClick={handleUpload}>送出</button>
    </>
  );
};

export default ImagePage;
