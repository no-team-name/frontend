import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import apiClient from './utils/apiSpring';

import { userState } from './recoil/UserAtoms';
import { authState } from './recoil/authAtoms';

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
import AboutUs from './pages/AboutUs';

import LoginModal from './components/auth/LoginModal';
import LogoutConfirmModal from './components/auth/LogoutConfirmModal';
import AccountDeleteModal from './components/auth/AccountDeleteModal';
import NicknameChangeModal from './components/auth/NicknameChangeModal';
import TopPlate from "./pages/TeamKanbanBoard/TopPlate";
import ProfileImageChangeModal from './components/auth/ProfileImageChangeModal';

import ChatButton from './components/ai/ChatButton';
import ChatBox from './components/ai/ChatBox';

import JoinBoardMain from "./pages/joinBoard/JoinBoardMain";
import JoinBoardDetail from "./pages/joinBoard/JoinBoardDetail";
import CreateJoinBoard from "./pages/joinBoard/CreateJoinBoard";
import EditJoinBoard from "./pages/joinBoard/EditJoinBoard";
import Dashboard from './pages/admin/DashBoard';
import ErrorPage from './pages/error/ErrorPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';

import Footer from './components/common/Footer';

import WithAuthComponent from './hoc/WithAuthComponent';
import OAuthCallback from './components/auth/OAuthCallback';


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
  const [showProfileImageChangeModal, setShowProfileImageChangeModal] = useState(false);

  useEffect(() => {
    console.log('App.js useEeffect')
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      console.log('accessToken 있음')
      setAuth(prev => ({ ...prev, isLogin: true }));

      apiClient.get('/api/member/userinfos', {

        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
        .then((res) => {

          console.log('조회 성공:', res);
          const { memberId, email, nickname, profileImage, role, teams } = res.data.memberInfo;
          setUser({
            isLogin: true,
            memberId,
            email,
            nickname,
            profileImage,
            role,
            teams
          });

          setAuth(prev => ({ ...prev, nickname: nickname, role: role, profileImage: profileImage }));

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

  // 프로필 이미지 변경
  const handleProfileImageUrlUpdate = (newProfileUrl) =>{
    setUser(prev => ({...prev, profileImage: newProfileUrl}))
  };
  

  const sharedProps = {
    isLogin,
    nickname,
    openLoginModal: () => setShowLoginModal(true),
    openLogoutModal: () => setShowLogoutModal(true),
    openAccountDeleteModal: () => setShowAccountDeleteModal(true),
    openNicknameModal: () => setShowNicknameModal(true),
    openProfileImageChangeModal: () => setShowProfileImageChangeModal(true),
  };

  return (
  <WebSocketProvider>
    <AudioParticipantsProvider>
      <BrowserRouter>
        <Routes>

            {/* ✅ 메인 페이지 (모든 사용자 접근 가능) */}
            <Route path="/" element={<Main {...sharedProps} />} />

            {/* ✅ 팀 페이지 (소속된 팀 멤버만 접근 가능) */}
            <Route path="/note/:team_id" element={<WithAuthComponent component={TeamNote} isTeamPage={true} {...sharedProps} />} />
            <Route path="/canvas/:teamId" element={<WithAuthComponent component={TeamCanvas} isTeamPage={true} {...sharedProps} />} />
            <Route path="/kanban-board/:teamId" element={<WithAuthComponent component={KanbanBoard} isTeamPage={true} {...sharedProps} />} />
            <Route path="/kanban-board/TopPlate" element={<WithAuthComponent component={TopPlate} isTeamPage={true} {...sharedProps} />} />

            {/* ✅ 초대 수락 페이지 (로그인 필요) */}
            <Route path="/accept-invite/:teamId" element={<WithAuthComponent component={AcceptInvitePage} {...sharedProps} />} />

            {/* ✅ 관리자 페이지 (ADMIN만 접근 가능) */}
            <Route path="/admin/dashboard" element={<WithAuthComponent component={Dashboard} requiredRole="ADMIN" {...sharedProps} />} />
            <Route path="/admin/members" element={<WithAuthComponent component={AdminMemberPage} requiredRole="ADMIN" {...sharedProps} />} />
            <Route path="/admin/members/:memberId" element={<WithAuthComponent component={AdminMemberDetailPage} requiredRole="ADMIN" {...sharedProps} />} />

            <Route path="/about-us" element={<AboutUs {...sharedProps} />} />

            {/* ✅ 가입 게시판 관련 (로그인 필요) */}
            <Route path="/join-board" element={<WithAuthComponent component={JoinBoardMain} {...sharedProps} />} />
            <Route path="/join-board/:id" element={<WithAuthComponent component={JoinBoardDetail} {...sharedProps} />} />
            <Route path="/create-join-board" element={<WithAuthComponent component={CreateJoinBoard} {...sharedProps} />} />
            <Route path="/edit-join-board/:id" element={<WithAuthComponent component={EditJoinBoard} {...sharedProps} />} />

            {/* ✅ 에러 페이지 (모든 사용자 접근 가능) */}
            <Route path="/error" element={<ErrorPage {...sharedProps} />} />
            <Route path="/unauthorized" element={<UnauthorizedPage {...sharedProps} />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />

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
      <ProfileImageChangeModal
        open={showProfileImageChangeModal}
        onClose={() => setShowProfileImageChangeModal(false)}
        currentprofileImageUrl={user.profileImage}
        onProfileUrlUpdate={handleProfileImageUrlUpdate}
      />
      <ChatButton onClick={() => setShowChatBox(true)} />
      <ChatBox isOpen={showChatBox} onClose={() => setShowChatBox(false)} />

      <Footer />
    </BrowserRouter>
    </AudioParticipantsProvider>
  </WebSocketProvider>

  );
}

export default App;