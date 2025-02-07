import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Input, Button, Divider, Message } from 'semantic-ui-react';
import apiClient from '../../utils/apiSpring';
import { useRecoilValue } from 'recoil';
import { authState } from '../../recoil/authAtoms';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import MainHeader from '../../components/common/MainHeader';
import "./AdminMemberPage.css";

const statusOptions = [
  { key: 'ACTIVE', value: 'ACTIVE', text: '계정활성화' },
  { key: 'BANNED', value: 'BANNED', text: '사용자차단' },
  { key: 'DELETED', value: 'DELETED', text: '사용자삭제' }
];

const AdminMemberPage = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };
  const { role } = useRecoilValue(authState);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (role === 'ADMIN') fetchMembers();
  }, [role]);

  const fetchMembers = async () => {
    try {
      const res = await apiClient.get(`/api/admin/members/search?keyword=${searchTerm}`);
      setMembers(res.data.content);
    } catch (err) {
      console.error('회원 조회 실패:', err);
    }
  };

  const handleStatusChange = async (memberId, status) => {
    try {
      await apiClient.put(`/api/admin/members/${memberId}/status`, { status });
      fetchMembers();
      setToastMessage({ type: 'success', content: '처리 완료!' });
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      setToastMessage({ type: 'error', content: '처리 실패' });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (role !== 'ADMIN') return <div>접근 권한이 없습니다</div>;

  return (
    <div> 
      <MainHeader
       logoSrc="/path/to/your/logo.png"
       openLoginModal={openLoginModal}
       openLogoutModal={openLogoutModal}
       openAccountDeleteModal={openAccountDeleteModal}
       openNicknameModal={openNicknameModal}
       onSidebarToggle={handleSidebarToggle}
      />
    <div className={`admin-container ${isSidebarOpen ? 'ml-64' : ''}`}>


      <div className="admin-page" style={{ padding: '20px' }}>
      <div class="ui secondary  menu">
        <Link to={`/admin/members`} class="item">
            회원관리
        </Link>
        <Link to={`/admin/dashboard`} class="item">
            대시보드
        </Link>
      </div>

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

      <Divider section style={{ marginTop: 0 }}/>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Input
          placeholder="닉네임 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          action={<Button onClick={fetchMembers}>검색</Button>}
          style={{ marginBottom: '10px' }}
        />
      </div>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>닉네임</Table.HeaderCell>
              <Table.HeaderCell>상태</Table.HeaderCell>
              <Table.HeaderCell>역할</Table.HeaderCell>
              <Table.HeaderCell>가입일</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {members.map((member, i) => {
              const rowZIndex = 999 - i;
    return (
      <Table.Row
        key={member.memberId}
        style={{ position: 'relative', zIndex: rowZIndex }}
      >
        <Table.Cell>
          <Link to={`/admin/members/${member.memberId}`}
                state={{ nickname: member.nickname, createdAt: member.createdAt }}>
            {member.nickname}
          </Link>
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            fluid
            selection
            options={statusOptions}
            value={member.status}
            onChange={(e, { value }) => handleStatusChange(member.memberId, value)}
          />
        </Table.Cell>
        <Table.Cell>{member.role}</Table.Cell>
        <Table.Cell>
          {new Date(member.createdAt).toLocaleDateString()}
        </Table.Cell>
      </Table.Row>
    );
  })}
</Table.Body>
        </Table>
      </div>
    </div>
    </div>
  );
};

export default AdminMemberPage;