import React from "react";
import { AiOutlineArrowLeft, AiOutlineShareAlt, AiOutlineMessage } from "react-icons/ai";

const NoteHeader = ({ participants, onBack, onShare, onChat }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-300">
      {/* 뒤로가기 버튼과 이미지 그룹 */}
      <div className="flex items-center gap-2">
        <img
          src="./accord-removebg.png"
          alt="Logo"
          className="h-10 object-contain"
        />
        <button
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          onClick={onBack}
        >
          <AiOutlineArrowLeft size={18} />
        </button>
      </div>

      {/* 우측 프로필 및 버튼 그룹 */}
      <div className="flex items-center gap-2">
        {/* 참여자 프로필 */}
        <div className="flex -space-x-3">
          {participants.map((participant, index) => (
            <img
              key={index}
              src={participant.profilePicture}
              alt={participant.name}
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{
                zIndex: participants.length - index, // 겹치는 순서 보정
              }}
            />
          ))}
        </div>

        {/* 채팅 버튼 */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          onClick={onChat}
        >
          <AiOutlineMessage size={18} />
        </button>

        {/* Share 버튼 */}
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          onClick={onShare}
        >
          <span className="text-sm">Share</span>
          <AiOutlineShareAlt size={16} />
        </button>
      </div>
    </div>
  );
};

export default NoteHeader;
