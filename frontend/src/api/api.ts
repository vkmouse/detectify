const API_URL = process.env.API_URL;

const api = {
  createUpload: async (filename: string): Promise<string> => {
    const response = await fetch(`${API_URL}/images/uploads`, {
      method: 'POST',
      body: JSON.stringify({ filename: filename }),
    });
    const body: { presignedURL: string } = await response.json();
    return body.presignedURL;
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
