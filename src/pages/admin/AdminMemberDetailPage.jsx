import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import apiClient from '../../utils/apiSpring';
import { authState } from '../../recoil/authAtoms';
import Sidebar from '../../components/common/Sidebar';
import MainHeader from '../../components/common/MainHeader';
import { Message, Icon } from 'semantic-ui-react';

const AdminMemberDetailPage = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) => {
  const { role } = useRecoilValue(authState);
  const { memberId } = useParams();
  const location = useLocation();
  const { nickname, createdAt } = location.state || {};
  const [boards, setBoards] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

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

  if (role !== 'ADMIN') return <div>접근 권한이 없습니다</div>;

  const handleDelete = async (boardId) => {
    try {
      await apiClient.delete(`/api/admin/boards/${boardId}`);
      setBoards(boards.filter(b => b.boardId !== boardId));
      setToastMessage({ type: 'success', content: '처리 완료!' });
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      setToastMessage({ type: 'error', content: '처리 실패' });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleBan = async (boardId) => {
    try {
      await apiClient.delete(`/api/admin/boards/${boardId}/ban`);
      setBoards(boards.filter(b => b.boardId !== boardId));
      setToastMessage({ type: 'success', content: '처리 완료!' });
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      setToastMessage({ type: 'error', content: '처리 실패' });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div>
      <MainHeader
        onBack={() => console.log('Back button clicked')}
        logoSrc="/accord-removebg.png"
        openLoginModal={openLoginModal}
        openLogoutModal={openLogoutModal}
        openAccountDeleteModal={openAccountDeleteModal}
        openNicknameModal={openNicknameModal}
      />

      {toastMessage && (
        <Message 
          positive={toastMessage.type === 'success'}
          negative={toastMessage.type === 'error'}
          floating
          style={{
            position: 'fixed',
            top: 150,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999
          }}
        >
          {toastMessage.content}
        </Message>
      )}
      
      <div className="member-detail" style={{ padding: '20px' }}>
        <h2>{nickname} 회원 정보</h2>
        <p>가입일: {new Date(createdAt).toLocaleDateString()}</p>
        <div style={{ marginBottom: '1.5rem' }}>
          <Button 
            as={Link} 
            to="/admin/members" 
            color='blue' 
            floated='right'
            icon
            labelPosition='left'>
            <Icon name='arrow left'/>
              회원 목록으로
          </Button>
          </div>
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
                <Table.Cell>
                <Link to={`/join-board/${board.boardId}`}>
                  {board.title}
                </Link>
                </Table.Cell>
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