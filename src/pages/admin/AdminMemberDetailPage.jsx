import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import apiClient from '../../utils/apiSpring';

import MainHeader from '../../components/common/MainHeader';

const AdminMemberDetailPage = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) => {
  const { memberId } = useParams();
  const location = useLocation();
  const { nickname, createdAt } = location.state || {};
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardsRes = await apiClient.get(`/api/admin/boards/${memberId}/boards`);
        setBoards(boardsRes.data.content);
      } catch (err) {
        console.error('데이터 조회 실패:', err);
      }
    };
    fetchData();
  }, [memberId]);

  if (!nickname) {
    return <div>잘못된 접근입니다. 관리자 페이지에서 회원을 선택해주세요.</div>;
  }

  const handleDelete = async (boardId) => {
    try {
      await apiClient.delete(`/api/admin/boards/${boardId}`);
      setBoards(boards.filter(b => b.boardId !== boardId));
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const handleBan = async (boardId) => {
    try {
      await apiClient.delete(`/api/admin/boards/${boardId}/ban`);
      setBoards(boards.filter(b => b.boardId !== boardId));
    } catch (err) {
      console.error('차단 실패:', err);
    }
  };

  return (
    <div>
      {/* 공통 헤더 */}
      <MainHeader
        onBack={() => console.log('Back button clicked')}
        logoSrc="/accord-removebg.png"
        openLoginModal={openLoginModal}
        openLogoutModal={openLogoutModal}
        openAccountDeleteModal={openAccountDeleteModal}
        openNicknameModal={openNicknameModal}
      />
      
      <div className="member-detail" style={{ padding: '20px' }}>
        <h2>{nickname} 회원 정보</h2>
        <p>가입일: {new Date(createdAt).toLocaleDateString()}</p>

        <h3>작성 게시글</h3>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>제목</Table.HeaderCell>
              <Table.HeaderCell>팀명</Table.HeaderCell>
              <Table.HeaderCell>기간</Table.HeaderCell>
              <Table.HeaderCell>처리</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {boards.map((board) => (
              <Table.Row key={board.boardId}>
                <Table.Cell>{board.title}</Table.Cell>
                <Table.Cell>{board.teamName}</Table.Cell>
                <Table.Cell>
                  {new Date(board.startDate).toLocaleDateString()} ~
                  {new Date(board.endDate).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <Button color="red" onClick={() => handleDelete(board.boardId)}>
                      삭제
                    </Button>
                    <Button.Or />
                    <Button color="orange" onClick={() => handleBan(board.boardId)}>
                      삭제 및 차단
                    </Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default AdminMemberDetailPage;