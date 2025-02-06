import apiClient from "../utils/apiSpring";

const getTeamChatHistory = async (teamId, chunkNumber=0) => {
  const response = await apiClient.get(`/api/chat/messages`, {
    params: { teamId, chunkNumber },
  });
  console.log('Fetched team chat history:', response);
  return response;
};

export { getTeamChatHistory };