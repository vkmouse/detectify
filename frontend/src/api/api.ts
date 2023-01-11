const API_URL = process.env.API_URL;

type CreateUploadResponse = {
  id: string;
  presignedURL: string;
};

export type Message = {
  content: string;
  imageURL: string;
};

const api = {
  addMessage: async (content: string, imageId: string) => {
    const response = await fetch(`${API_URL}/message`, {
      method: 'POST',
      body: JSON.stringify({ content, imageId }),
    });
    await response.json();
  },
  getMessages: async (): Promise<Message[]> => {
    const response = await fetch(`${API_URL}/message`);
    const body: { data: Message[] } = await response.json();
    return body.data;
  },
  createUpload: async (): Promise<CreateUploadResponse> => {
    const response = await fetch(`${API_URL}/image/upload`, {
      method: 'POST',
    });
    const body: { data: CreateUploadResponse } = await response.json();
    return body.data;
  },
  uploadStorageService: async (
    presignedURL: string,
    file: File
  ): Promise<boolean> => {
    const response = await fetch(presignedURL, {
      method: 'PUT',
      body: file,
    });
    const body = await response.text();
    return body === '';
  },
};

export default api;
