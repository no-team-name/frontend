import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRecoilState } from 'recoil';

import { userState } from './recoil/UserAtoms';

import TeamNote from './pages/TeamNote/TeamNote';
import TeamCanvas from './pages/TeamCanvas/TeamCanvas';
import AcceptInvitePage from './pages/team/AcceptInvitePage';
import Main from './pages/Main';
import { WebSocketProvider } from './context/WebSocketContext';
import { AudioParticipantsProvider } from './context/AudioParticipantsContext';

import LoginModal from './components/auth/LoginModal';
import LogoutConfirmModal from './components/auth/LogoutConfirmModal';
import AccountDeleteModal from './components/auth/AccountDeleteModal';
import NicknameChangeModal from './components/auth/NicknameChangeModal';

import ChatButton from './components/ai/ChatButton';
import ChatBox from './components/ai/ChatBox';

import apiClient from './utils/apiSpring';

import { authState } from './recoil/authAtoms';

import JoinBoardMain from "./pages/joinBoard/JoinBoardMain";
import JoinBoardDetail from "./pages/joinBoard/JoinBoardDetail";
import CreateJoinBoard from "./pages/joinBoard/CreateJoinBoard";
import EditJoinBoard from "./pages/joinBoard/EditJoinBoard";

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
      apiClient.get('/api/member/userinfos', {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
        .then((res) => {

          console.log('조회 성공:', res);
          const { memberId, email, nickname, profileImage } = res.data.memberInfo;
          setUser({
            isLogin: true,
            memberId,
            email,
            nickname,
            profileImage,
          });

          setAuth(prev => ({ ...prev, nickname: nickname }));

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

          <Route path="/join-board" element={<JoinBoardMain />} />
          <Route path="/join-board/:id" element={<JoinBoardDetail />} />
          <Route path="/create-join-board" element={<CreateJoinBoard />} />
          <Route path="/edit-join-board/:id" element={<EditJoinBoard />} />
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