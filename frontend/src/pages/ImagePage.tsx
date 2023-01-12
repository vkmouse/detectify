import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import api, { Message } from '../api/api';

const ImageUploader = styled.input.attrs({
  type: 'file',
  accept: '.jpg,.jpeg,.png',
})``;

export const CenterCropped = styled.img`
  object-fit: cover;
  object-position: center;
`;

const ImagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const selectedFilePath = useRef('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const { refetch: updateMessages, isFetching: updateMessagesIsFetching } =
    useQuery({
      queryKey: ['updateMessages'],
      queryFn: async () => {
        const messages = await api.getMessages();
        setMessages(messages.reverse());
        return true;
      },
      enabled: true,
    });

  const { refetch: sendMessage, isFetching: sendMessageIsFetching } = useQuery({
    queryKey: ['sendMessage'],
    queryFn: async () => {
      if (selectedFilePath && selectedFile) {
        const response = await api.createUpload();
        const imageId = response.id;
        await api.uploadStorageService(response.presignedURL, selectedFile);
        await api.addMessage(content, imageId);
        updateMessages();
        setContent('');
        selectedFilePath.current = '';
        setSelectedFile(undefined);
      }
      return true;
    },
    enabled: false,
  });

  const buttonDisabled =
    updateMessagesIsFetching ||
    sendMessageIsFetching ||
    selectedFile === undefined ||
    selectedFilePath.current === '' ||
    content === '';

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
        <ImageUploader
          value={selectedFilePath.current}
          onChange={(e) => {
            selectedFilePath.current = e.target.value;
            setSelectedFile(e.target.files?.[0]);
          }}
        />
      </div>
      <button disabled={buttonDisabled} onClick={() => sendMessage()}>
        送出
      </button>
      <hr />
      {messages.map((message, i) => {
        return (
          <div key={i}>
            <p>{message.content}</p>
            <CenterCropped
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
