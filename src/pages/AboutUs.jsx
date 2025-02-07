import React, { useState } from 'react';
import MainHeader from '../components/common/MainHeader';
import TeamMemberCard from '../components/common/TeamMemberCard';
import parkImg from '../assets/park.png';
import choiImg from '../assets/choi.png';
import simImg from '../assets/sim.png';
import jungImg from '../assets/jung.png';
import leeImg from '../assets/lee.png';

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
      {/* 콘텐츠 영역 (배경 위에 표시) */}
      <div className="relative z-10 p-4">
          {/* 프로젝트 소개 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">프로젝트 팀원 소개</h1>
          </div>

          {/* 팀원 카드 (3개 + 2개) */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <TeamMemberCard
              imageUrl={choiImg}
              memberName="최요셉"
              github="https://github.com/yoda-yoda/yoda-yoda"
              email="aslopeys941@gmail.com"
            />
            <TeamMemberCard
              imageUrl={parkImg}
              memberName="박유빈"
              github="https://github.com/yyubin"
              email="hazing0910@gmail.com"
            />
            <TeamMemberCard
              imageUrl={jungImg}
              memberName="정석환"
              github="https://github.com/SeokHwanJeongKR"
              email="jsver12@gmail.com"
            />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <TeamMemberCard
              imageUrl={leeImg}
              memberName="이시현"
              github="https://github.com/Philo-LEE"
              email="tlgus7777@gmail.com"
            />
            <TeamMemberCard
              imageUrl={simImg}
              memberName="심윤보"
              github="https://github.com/Waffle-ens/Project_Repository1"
              email="ensoary@gmail.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;