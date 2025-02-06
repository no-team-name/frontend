import React, { useState } from 'react';
import MainHeader from '../components/common/MainHeader';

const AboutUs = ({
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
        <div className="w-[700px] h-[700px] bg-gradient-to-r from-red-300 via-purple-300 to-blue-300 blur-3xl opacity-50 rounded-full"></div>
      </div>
      </div>
    </div>
  );
};

export default AboutUs;