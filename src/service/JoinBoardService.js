import axios from "axios";
import apiClient from "../utils/apiSpring";
//

// const API_BASE_URL = "http://localhost:8080";

// 게시판 목록 최신순으로 가져오기 (페이지 번호를 파라미터로 전달)
export const getJoinBoardCard = async (page = 0) => {
    try {
        const response = await apiClient.get(`/api/join-board?page=${page}`);
        console.log(response);
        return response;
    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error; // 에러를 던져서 호출하는 쪽에서 처리하도록 함
    }
}

// 게시판 제목순으로 가져오기 (페이지 번호를 파라미터로 전달)
export const getJoinBoardCardByTitle = async (page = 0) => {
    try {
        const response = await apiClient.get(`/api/join-board/sort-by-title?page=${page}`);
        console.log(response);
        return response;
    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error; // 에러를 던져서 호출하는 쪽에서 처리하도록 함
    }
}


// 검색
export const searchJoinBoard = async (query, page = 0) => {
    try {
        const response = await apiClient.post(
            `/api/join-board/search?page=${page}`, // 페이지 번호는 쿼리 파라미터로 전송
            {
                input: query, // 검색어는 본문(body)로 전송
            }
        );
        return response;
    } catch (error) {
        console.error("검색 요청 오류:", error);
    }
};



// 특정 게시글 가져오기
export const getJoinBoard = async (joinBoardId) => {
    try {
        const response = await apiClient.get(`/api/join-board/${joinBoardId}`);
        console.log(response); // 응답 로그를 확인하세요
        // 응답에서 실제 데이터에 접근
        if (response && response.data && response.data.data) {
            return response.data.data; // 실제 데이터 반환
        } else {
            console.error("No data found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching board detail:", error);
        return null;
    }
};


// 게시글 작성하기 (POST 요청)
export const createJoinBoard = async (boardData) => {
    try {
        const response = await apiClient.post(`/api/join-board`, boardData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 서버 응답 데이터 반환
    } catch (error) {
        console.error("게시글 작성 실패:", error);
        return null;
    }
};


// 게시글 수정 API 호출
export const updateJoinBoard = async (id, boardData) => {
    try {
        const response = await apiClient.put(`/api/join-board/${id}`, boardData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("게시글 수정 실패:", error);
        throw error;
    }
};

// 게시글 삭제 API 호출
export const deleteJoinBoard = async (id) => {
    try {
        const response = await apiClient.delete(`/api/join-board/${id}`);
        return response.data;
    } catch (error) {
        console.error("게시글 삭제 실패:", error);
        throw error;
    }
};









// 특정 게시글의 댓글 가져오기
export const getAllCommentByJoinBoardId = async (joinBoardId) => {
    try {
        const response = await apiClient.get(`/api/comment/${joinBoardId}`);
        return response.data.data;
    } catch (error) {
        console.error("댓글 가져오기 실패:", error);
        throw error;
    }
};

// 댓글 작성
export const createComment = async (joinBoardId, commentData, parentCommentId = null) => {

    console.log(' parentCommentId:', parentCommentId);  // parentCommentId가 올바르게 출력되는지 확인

    try {
        // parentCommentId가 있으면 쿼리 파라미터로 추가
        const response = await apiClient.post(`/api/comment/${joinBoardId}`, commentData, {
            params: {
                parentCommentId: parentCommentId
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        alert('댓글 작성에 실패하였습니다.');
        console.error("댓글 작성 실패:", error);
        throw error;
    }
};

// 댓글 수정
export const updateComment = async (commentId, commentData) => {
    try {
        const response = await apiClient.put(`/api/comment/${commentId}`, commentData);
        return response.data;
    } catch (error) {
        console.error("댓글 수정 실패:", error);
        throw error;
    }
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
    try {
        const response = await apiClient.delete(`/api/comment/${commentId}`);
        return response.data;
    } catch (error) {
        alert('댓글 삭제에 실패하였습니다.');
        console.error("댓글 삭제 실패:", error);
        throw error;
    }
};




