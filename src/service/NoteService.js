import apiClient from '../utils/apiGo';

const saveNote = async (note) => {
  try {
    const response = await apiClient.post('/note', note, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
    throw error;
  }
};

const getNotesByTeamID = async (teamId) => {
  try {
    const response = await apiClient.get(`/note/team/${teamId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
    throw error;
  }
};

const getNoteByID = async (id) => {
  try {
    const response = await apiClient.get(`/note/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
    throw error;
  }
};

const updateNoteTitle = async (id, newTitle) => {
  try {
    const response = await apiClient.put(`/note/${id}/title`, { new_title: newTitle }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
    throw error;
  }
};

const deleteNoteByID = async (id) => {
  try {
    const response = await apiClient.delete(`/note/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
    throw error;
  }
};

export { saveNote, getNotesByTeamID, getNoteByID, updateNoteTitle, deleteNoteByID };