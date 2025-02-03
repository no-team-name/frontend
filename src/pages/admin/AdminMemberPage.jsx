import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Input, Button } from 'semantic-ui-react';
import apiClient from '../../utils/apiSpring';
import { useRecoilValue } from 'recoil';
import { authState } from '../../recoil/authAtoms';
import { Link } from 'react-router-dom';

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
  const { role } = useRecoilValue(authState);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    } catch (err) {
      console.error('상태 변경 실패:', err);
    }
  };

  if (role !== 'ADMIN') return <div>접근 권한이 없습니다</div>;

  return (
    <div>
      {/* 공통 헤더 (MainHeader) 삽입 */}
      <MainHeader
        onBack={() => console.log('Back button clicked')}
        logoSrc="/accord-removebg.png"
        openLoginModal={openLoginModal}
        openLogoutModal={openLogoutModal}
        openAccountDeleteModal={openAccountDeleteModal}
        openNicknameModal={openNicknameModal}
      />

      <div className="admin-page" style={{ padding: '20px' }}>
        <Input
          placeholder="닉네임 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          action={<Button onClick={fetchMembers}>검색</Button>}
          style={{ marginBottom: '20px' }}
        />

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
    const rowZIndex = 9999 - i; // i=0이 가장 큰 zIndex

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
  );
};

export default AdminMemberPage;