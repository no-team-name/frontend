import apiClient from '../utils/apiSpring';

const uploadImage = async (file, canvasId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('canvasId', canvasId);

  const response = await apiClient.post('/api/images/canvases', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response.data.data.url);
  return response.data.data.url;
};

const uploadNoteImage = async (file, noteId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('noteId', noteId);

  const response = await apiClient.post('/api/images/notes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response.data.data.url);
  return response.data.data.url;
};

export { uploadImage, uploadNoteImage };