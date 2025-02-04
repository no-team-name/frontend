import React, { useState } from 'react';
import MainHeader from '../components/common/MainHeader';
import Typing from 'react-typing-effect'; 

const Main = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

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
    <div className={`main-container relative min-h-screen flex flex-col items-center justify-center bg-gray-50 ${isSidebarOpen ? 'ml-64' : ''}`}>
      {/* 헤더 */}

      {/* 배경 효과 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-r from-green-300 via-red-300 to-blue-300 blur-3xl opacity-40 rounded-full"></div>
      </div>
      {/* 콘텐츠 중앙 정렬 */}
      <div className="text-center max-w-4xl z-10">
        {/* 메인 타이틀 */}
        <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight">
          The collaboration suite to <br />
          <span className="text-black font-extrabold">build projects with</span>
          <br />
          <span className="text-gray-700 italic">
            <Typing
              text={["real time experience"]}
              speed={100}  // 타이핑 속도
              eraseSpeed={50}  // 지워지는 속도
              eraseDelay={2000}  // 유지 시간
              typingDelay={500}  // 새로 시작하는 지연 시간
              loop={true}  // 무한 반복
            />
          </span>
        </h1>

        {/* 설명 */}
        <p className="mt-6 text-xl md:text-2xl text-gray-600">
          Our platform offers a comprehensive suite of tools for seamless collaboration. Engage in real-time voice chats, create and share interactive canvases, collaborate on notes, manage projects with team kanban boards, and find team members in our community.
        </p>

        {/* 버튼 그룹 */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center z-20">
          <button className="px-8 py-4 bg-black text-white text-lg md:text-xl font-semibold rounded-lg shadow-md hover:bg-gray-900 transition">
            Sign up free →
          </button>
          <button className="px-8 py-4 border border-gray-400 text-black text-lg md:text-xl font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
            Try it live
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Main;
