import apiClient from '../utils/apiGo';

export const createCanvas = async (canvasData) => {
  try {
    const response = await apiClient.post('/canvas', canvasData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw error;
  }
};

export const getCanvasByID = async (id) => {
  try {
    const response = await apiClient.get(`/canvas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching canvas by ID:', error);
    throw error;
  }
};

export const getCanvasByTeamID = async (teamId) => {
  try {
    const response = await apiClient.get(`/canvas/team/${teamId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Canvas by team ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching canvas by team ID:', error);
    throw error;
  }
};

export const updateCanvasTitle = async (id, newTitle) => {
  try {
    const response = await apiClient.put(`/canvas/${id}/title`, { new_title: newTitle }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating canvas title:', error);
    throw error;
  }
};

export const deleteCanvasByID = async (id) => {
  try {
    const response = await apiClient.delete(`/canvas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting canvas:', error);
    throw error;
  }
};