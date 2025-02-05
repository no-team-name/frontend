import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRecoilState } from 'recoil';

import { userState } from './recoil/UserAtoms';

import AdminMemberPage from './pages/admin/AdminMemberPage';
import AdminMemberDetailPage from './pages/admin/AdminMemberDetailPage';
import TeamNote from './pages/TeamNote/TeamNote';
import TeamCanvas from './pages/TeamCanvas/TeamCanvas';
import KanbanBoard from './pages/TeamKanbanBoard/KanbanBoard';
import Card from "./pages/TeamKanbanBoard/Card";
import AcceptInvitePage from './pages/team/AcceptInvitePage';
import Main from './pages/Main';
import { WebSocketProvider } from './context/WebSocketContext';
import { AudioParticipantsProvider } from './context/AudioParticipantsContext';

import LoginModal from './components/auth/LoginModal';
import LogoutConfirmModal from './components/auth/LogoutConfirmModal';
import AccountDeleteModal from './components/auth/AccountDeleteModal';
import NicknameChangeModal from './components/auth/NicknameChangeModal';
import TopPlate from "./pages/TeamKanbanBoard/TopPlate";


import ChatButton from './components/ai/ChatButton';
import ChatBox from './components/ai/ChatBox';

import { authState } from './recoil/authAtoms';


import JoinBoardMain from "./pages/joinBoard/JoinBoardMain";
import JoinBoardDetail from "./pages/joinBoard/JoinBoardDetail";
import CreateJoinBoard from "./pages/joinBoard/CreateJoinBoard";
import EditJoinBoard from "./pages/joinBoard/EditJoinBoard";
import Dashboard from './pages/admin/DashBoard';
import ErrorPage from './pages/error/ErrorPage';

function App() {

  const [user, setUser] = useRecoilState(userState);
  const [isLogin, setIsLogin] = useState(false);
  const [nickname, setNickname] = useState('');

  const [auth, setAuth] = useRecoilState(authState);


  // 모달 open/close 관리
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    console.log('App.js useEeffect')
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      console.log('accessToken 있음')
      setAuth(prev => ({ ...prev, isLogin: true }));

      // 서버에서 닉네임 가져오기
      axios.get('http://localhost:8082/spring/api/member/userinfos', {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
        .then((res) => {

          console.log('조회 성공:', res);
          const { memberId, email, nickname, profileImage, role } = res.data.memberInfo;
          setUser({
            isLogin: true,
            memberId,
            email,
            nickname,
            profileImage,
            role
          });

          setAuth(prev => ({ ...prev, nickname: nickname, role: role }));

        })
        .catch((err) => {
          console.error('닉네임 조회 실패:', err);
          setAuth({ isLogin: false, nickname: '' });
        });
    } else {
      setAuth({ isLogin: false, nickname: '' });
    }
  }, [setAuth]);

  // 로그아웃 완료
  const handleLogoutSuccess = () => {
    setAuth({ isLogin: false, nickname: '' });
  };

  // 회원탈퇴 완료
  const handleDeleteSuccess = () => {
    setAuth({ isLogin: false, nickname: '' });
  };

  // 닉네임 변경
  const handleNicknameUpdate = (newNickname) => {
    setAuth(prev => ({ ...prev, nickname: newNickname }));
  };

  const sharedProps = {
    isLogin,
    nickname,
    openLoginModal: () => setShowLoginModal(true),
    openLogoutModal: () => setShowLogoutModal(true),
    openAccountDeleteModal: () => setShowAccountDeleteModal(true),
    openNicknameModal: () => setShowNicknameModal(true),
  };

  return (
  <WebSocketProvider>
    <AudioParticipantsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main {...sharedProps} />} />
          <Route path="/note/:team_id" element={<TeamNote {...sharedProps} />} />
          <Route path="/canvas/:teamId" element={<TeamCanvas {...sharedProps} />} />
          <Route path="/accept-invite/:teamId" element={<AcceptInvitePage />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/error" element={<ErrorPage />} />

          <Route path="/join-board" element={<JoinBoardMain {...sharedProps} />} />
          <Route path="/join-board/:id" element={<JoinBoardDetail {...sharedProps} />} />
          <Route path="/create-join-board" element={<CreateJoinBoard {...sharedProps} />} />
          <Route path="/edit-join-board/:id" element={<EditJoinBoard {...sharedProps} />} />
            
          <Route path="/kanban-board/:teamId" element={<KanbanBoard {...sharedProps}/>} />
          <Route path="/kanban-board/TopPlate" element={<TopPlate {...sharedProps} />} />

          <Route path="/admin/members" element={<AdminMemberPage {...sharedProps} />} />
          <Route path="/admin/members/:memberId" element={<AdminMemberDetailPage {...sharedProps} />} />

        </Routes>


      {/* 모달들 */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogoutSuccess={handleLogoutSuccess}
      />
      <AccountDeleteModal
        open={showAccountDeleteModal}
        onClose={() => setShowAccountDeleteModal(false)}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <NicknameChangeModal
        open={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        currentNickname={auth.nickname}
        onNicknameUpdate={handleNicknameUpdate}
      />
      <ChatButton onClick={() => setShowChatBox(true)} />
      <ChatBox isOpen={showChatBox} onClose={() => setShowChatBox(false)} />
    </BrowserRouter>
    </AudioParticipantsProvider>
  </WebSocketProvider>

  );
}

export default App;