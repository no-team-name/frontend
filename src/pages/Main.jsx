import React, { useState } from 'react';
import MainHeader from '../components/common/MainHeader';
import Typing from 'react-typing-effect';
import { Icon } from 'semantic-ui-react';
import { AiFillRobot } from 'react-icons/ai';
import LogoCarousel from '../components/common/LogoCarousel';

const Main = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
  openProfileImageChangeModal
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
        openProfileImageChangeModal={openProfileImageChangeModal}
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
      <div className={`main-container relative bg-gray-50 ${isSidebarOpen ? 'ml-64' : ''}`}>
      <LogoCarousel />
      </div>
      {/* 서비스 소개 섹션 */}
      <section className={`main-container relative py-40 bg-gray-50 ${isSidebarOpen ? 'ml-64' : ''}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-14">
            <span
              className="block font-extrabold text-black"
              style={{ fontSize: '84px', lineHeight: '1', marginBottom: '0.2em' }}
            >
              Create your project
            </span>
            <span
              className="block text-gray-700"
              style={{ fontSize: '79.8px', lineHeight: '0.7', marginBottom: '0.2em' }}
            >
              with the features
            </span>
            <span
              className="block text-gray-700"
              style={{ fontSize: '79.8px', lineHeight: '0.3', marginBottom: '0.2em'}}
            >
              you want
            </span>
          </h2>
          <p className="text-center text-[26px] text-gray-600 mb-12" style={{ lineHeight: '1.5' }}>
            Accord empowers you to build and manage projects seamlessly using innovative tools like <br />AI Chat, design collaboration, team notes, kanban boards, voice chat, and live text chat.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {/* AI Chat Card */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-[367px] h-[451.5px]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <AiFillRobot style={{ color: 'black', fontSize: '3rem' }} />
                </div>
                <div className="w-[290px] h-[231px] flex flex-col items-center justify-center select-none">
                  <h3 className="text-2xl font-semibold mb-3">AI Chat</h3>
                  <p className="text-gray-700 text-center">
                    Experience intelligent, AI-powered chat designed to streamline team collaboration and boost productivity.
                  </p>
                </div>
              </div>
            </div>
            {/* Design Card */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-[367px] h-[451.5px]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <Icon name="paint brush" size="huge" color="black" />
                </div>
                <div className="w-[290px] h-[231px] flex flex-col items-center justify-center select-none">
                  <h3 className="text-2xl font-semibold mb-3">Design</h3>
                  <p className="text-gray-700 text-center">
                    Collaborate in real-time to share and edit design files, ensuring a seamless creative workflow.
                  </p>
                </div>
              </div>
            </div>
            {/* Team Notes Card */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-[367px] h-[451.5px]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <Icon name="sticky note" size="huge" color="black" />
                </div>
                <div className="w-[290px] h-[231px] flex flex-col items-center justify-center select-none">
                  <h3 className="text-2xl font-semibold mb-3">Team Notes</h3>
                  <p className="text-gray-700 text-center">
                    Collaborate on documents and ideas seamlessly with interactive team notes that keep everyone aligned.
                  </p>
                </div>
              </div>
            </div>
            {/* Kanban Board Card */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-[367px] h-[451.5px]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <Icon name="tasks" size="huge" color="black" />
                </div>
                <div className="w-[290px] h-[231px] flex flex-col items-center justify-center select-none">
                  <h3 className="text-2xl font-semibold mb-3">Kanban Board</h3>
                  <p className="text-gray-700 text-center">
                    Visualize and manage your project workflow effortlessly with our intuitive kanban board.
                  </p>
                </div>
              </div>
            </div>
            {/* Voice Chat Card */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-[367px] h-[451.5px]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <Icon name="headphones" size="huge" color="black" />
                </div>
                <div className="w-[290px] h-[231px] flex flex-col items-center justify-center select-none">
                  <h3 className="text-2xl font-semibold mb-3">Voice Chat</h3>
                  <p className="text-gray-700 text-center">
                    Engage in real-time voice conversations for smooth and efficient team communication.
                  </p>
                </div>
              </div>
            </div>
            {/* Chat Card */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-[367px] h-[451.5px]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <Icon name="chat" size="huge" color="black" />
                </div>
                <div className="w-[290px] h-[231px] flex flex-col items-center justify-center select-none">
                  <h3 className="text-2xl font-semibold mb-3">Chat</h3>
                  <p className="text-gray-700 text-center">
                    Communicate instantly through our streamlined text chat for effortless information exchange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
