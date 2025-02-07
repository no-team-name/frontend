import apiClient from "../utils/apiSpring";

const getKanbanBoardByTeamId = async (teamId) => {
    const response = await apiClient.get(`/api/kanbanboard/${teamId}`);
    return response.data;
}

const getTeam = async (teamId) => {
    const response = await apiClient.get(`/api/kanbanboard/team/${teamId}`);
    return response.data;
}

const createKanbanBoardColumn = async (teamId, title) => {
    const response = await apiClient.post(`/api/kanbanboard`, {
      teamId: teamId,
      title: title
    })
    return response;
}

const deleteKanbanBoardColumn = async (boardId) => {
    const response = await apiClient.delete(`/api/kanbanboard`, {
        data: { boardId }
    })
    return response;
}

const createKanbanBoardCard = async (memberId,teamId,content,columnId) => {
    const response = await apiClient.post(`/api/kanbanboardcard`, {
        memberId: memberId,
        teamId: teamId,
        content: content,
        columnId: columnId
    })
    return response;
}

const deleteKanbanBoardCard = async (cardId) => {
    const response = await apiClient.delete(`/api/kanbanboardcard`, {
        data: { cardId }
    })
    return response;
}

const updateKanbanBoard = async (boardId,title) => {
    const response = await apiClient.put(`/api/kanbanboard`, {
        boardId: boardId,
        title: title
    })
}

const updateKanbanBoardCard = async (cardId,content) => {
    const response = await apiClient.put(`/api/kanbanboardcard`, {
        cardId: cardId,
        content: content
    })
}

const changeKanbanBoardPriority = async (boardId,newPriority,teamId) => {
    const response = await apiClient.post(`/api/kanbanboard/switch`, {
        boardId: boardId,
        newPriority: newPriority,
        teamId: teamId
    })
}

const changeKanbanBoardCardPriorty = async (teamId, cardId,currentBoardId,newPriority,newBoardId) => {
    const response = await apiClient.post(`/api/kanbanboardcard/switch`, {
        teamId: teamId,
        cardId: cardId,
        currentBoardId: currentBoardId,
        newPriority: newPriority,
        newBoardId: newBoardId,
    })
    console.log("switch", response);
    return response;
}



export {getKanbanBoardByTeamId, createKanbanBoardColumn, deleteKanbanBoardColumn,
    createKanbanBoardCard, deleteKanbanBoardCard, updateKanbanBoard, updateKanbanBoardCard,
changeKanbanBoardPriority, changeKanbanBoardCardPriorty, getTeam}