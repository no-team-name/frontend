import axios from 'axios';

const BASE_URL = "http://localhost:8080";

const uploadImage = async (file, canvasId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('canvasId', canvasId);

  const response = await axios.post(`${BASE_URL}/api/images/canvases`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response.data.data.url)
  return response.data.data.url;
};

const uploadNoteImage = async (file, noteId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('noteId', noteId);

  const response = await axios.post(`${BASE_URL}/api/images/notes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response.data.data.url)
  return response.data.data.url;
};

export { uploadImage, uploadNoteImage };