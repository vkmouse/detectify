import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api, { Message } from '../api/api';

const ImageUploader = styled.input.attrs({
  type: 'file',
  accept: '.jpg,.jpeg,.png',
})``;

const ImagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const updateMessages = async () => {
    const messages = await api.getMessages();
    setMessages(messages);
  };

  const handleUpload = async () => {
    if (file) {
      const response = await api.createUpload();
      const imageId = response.id;
      await api.uploadStorageService(response.presignedURL, file);
      await api.addMessage(content, imageId);
      await updateMessages();
    }
  };

  useEffect(() => {
    updateMessages();
  }, []);

  return (
    <>
      <h1>發表一篇圖文</h1>
      <div>
        <span>請輸入文字: </span>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></input>
      </div>
      <div>
        <span>請選擇檔案: </span>
        <ImageUploader onChange={(e) => setFile(e.target.files?.[0])} />
      </div>
      <button onClick={handleUpload}>送出</button>
      <hr />
      {messages.map((message, i) => {
        return (
          <div key={i}>
            <p>{message.content}</p>
            <img
              width={300}
              height={200}
              src={message.imageURL}
              alt={String(i)}
            />
            <hr />
          </div>
        );
      })}
    </>
  );
};

export default ImagePage;
