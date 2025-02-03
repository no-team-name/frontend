import axios from 'axios';

const getKanbanBoardByTeamId = async (teamId) => {
    const response = await axios.get(`http://localhost:8080/api/kanbanboard/${teamId}`)
    return response.data;
}

const createKanbanBoardColumn = async (teamId, title) => {
    const response = await axios.post(`http://localhost:8080/api/kanbanboard/create`, {
      teamId: teamId,
      title: title
    })
    return response;
}

const deleteKanbanBoardColumn = async (boardId) => {
    const response = await axios.post(`http://localhost:8080/api/kanbanboard/delete`, {
        boardId: boardId
    })
    return response;
}




export {getKanbanBoardByTeamId, createKanbanBoardColumn, deleteKanbanBoardColumn}