import React, { useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineShareAlt,
  AiOutlineMessage,
  AiOutlineMenu,
  AiOutlineSave,
} from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { authState } from '../../recoil/authAtoms';

import LoginButton from "../auth/LoginButton";
import ProfileButton from "../auth/ProfileButton";
import ShareModal from './ShareModal';
import TeamChat from "../teamChat/TeamChat";

const NoteHeader = ({
  teamId,
  participants = [],
  onBack,
  onShare,
  onChat,
  onMenu,
  onSave,
  // App에서 내려온 props
  onOpenLoginModal,
  onOpenLogoutModal,
  onOpenAccountDeleteModal,
  onOpenNicknameModal,
}) => {
  const { isLogin, nickname } = useRecoilValue(authState);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };


  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-300">
      {/* 왼쪽 */}
      <div className="flex items-center gap-2" onClick={() => navigate('/')}>
        <img
          src="/accord-removebg.png"
          alt="Logo"
          className="h-10 object-contain"
        />
      </div>

      {/* 오른쪽 */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-3">
          {participants.map((participant, index) => (
            <img
              key={participant.id}
              src={participant.profilePicture || "https://i.namu.wiki/i/qEQTv7w9d-OZ6l9g5pF87sgGMaXwjFaLecd_VeZef-L9jNn86zKPX8CwIhkyPKo4dAp-7f83ZT25fpJr-UeFk0bGyroMp0to_XgnsLD5UZLKDBnqlMuKsUtVctbNLGWYNAtWdJGs7gfN8SLMOnNeuw.webp"}
              alt={participant.name}
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{
                zIndex: participants.length - index,
              }}
            />
          ))}
        </div>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-md border 
                     border-gray-300 bg-gray-100 text-gray-600 
                     hover:text-gray-900 hover:bg-gray-200"
          onClick={handleChatClick}
        >
          <AiOutlineMessage size={18} />
        </button>
        <button
          className="flex items-center gap-1 h-8 px-2 py-1 rounded-md border 
                     border-gray-300 bg-gray-100 text-gray-600 
                     hover:text-gray-900 hover:bg-gray-200"
          onClick={handleShareClick}
        >
          <span className="text-sm">Share</span>
          <AiOutlineShareAlt size={16} />
        </button>
        <button
          className="flex items-center gap-1 h-8 px-2 py-1 rounded-md border 
                     border-gray-300 bg-gray-100 text-gray-600 
                     hover:text-gray-900 hover:bg-gray-200"
          onClick={onSave}
        >
          <span className="text-sm">Save</span>
          <AiOutlineSave size={16} />
        </button>

        {isLogin ? (
          <ProfileButton
            nickname={nickname}
            onOpenNicknameModal={onOpenNicknameModal}
            onOpenAccountDeleteModal={onOpenAccountDeleteModal}
            onOpenLogoutConfirm={onOpenLogoutModal}
          />
        ) : (
          <LoginButton onClick={onOpenLoginModal} />
        )}
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={handleCloseShareModal} teamId={teamId} />
      {isChatOpen && <TeamChat teamId={teamId} onClose={handleCloseChat} />}
    </div>
  );
};

export default NoteHeader;