import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/UserAtoms';

function ProfileButton({
  onOpenNicknameModal,
  onOpenAccountDeleteModal,
  onOpenProfileImageModal,
  onOpenLogoutConfirm,
}) {
  const navigate = useNavigate();
  const { nickname, role } = useRecoilValue(userState);
  const [open, setOpen] = useState(false);

  const trigger = (
    <span style={{ cursor: 'pointer' }}>
      <Icon name="user circle" size="large" />
    </span>
  );

  const options = [
    {
      key: 'welcome',
      text: `${nickname || '손님'} 님 안녕하세요!`,
      disabled: true,
    },
    role === 'ADMIN' && {
      key: 'admin',
      text: '관리페이지',
      icon: 'shield',
      onClick: () => navigate('/admin/members')
    },
    {
      key: 'nicknameChange',
      text: '닉네임 변경',
      icon: 'edit',
      onClick: () => {
        setOpen(false);
        onOpenNicknameModal();
      },
    },
    {
      key: 'changeProfileImg',
      text: '프로필 이미지 변경',
      icon: 'images',
      onClick: () => {
        setOpen(false);
        onOpenProfileImageModal();
      },
    },
    {
      key: 'logout',
      text: '로그아웃',
      icon: 'sign out',
      onClick: () => {
        setOpen(false);
        onOpenLogoutConfirm();
      },
    },
    {
      key: 'accountDelete',
      text: '회원탈퇴',
      icon: 'user times',
      onClick: () => {
        setOpen(false);
        onOpenAccountDeleteModal();
      },
    },
  ].filter(Boolean);

  return (
    <Dropdown
      trigger={trigger}
      options={options}
      icon={null}
      pointing="top right"
      open={open}
      onClick={() => setOpen(!open)}
      onClose={() => setOpen(false)}
      style={{ marginLeft: '1rem', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }} 
    />
  );
}

export default ProfileButton;