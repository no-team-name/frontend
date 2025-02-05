import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import AudioChat from '../audio/AudioChat';
import TeamList from './TeamList';
import TeamService from '../../service/TeamService';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/UserAtoms';

const Sidebar = ({ isOpen, onClose }) => {
  const [activeTeams, setActiveTeams] = useState([]);
  const [showAudioChat, setShowAudioChat] = useState(false);
  const navigate = useNavigate();
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teams, setTeams] = useState([]);
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await TeamService.getTeamsByMemberId(user.memberId);
        console.log('Fetched teams:', response);
        setTeams(response);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    if (user.isLogin) {
      fetchTeams();
    }
  }, [user.memberId]);

  const handleVoiceClick = (teamId) => {
    console.log("Clicked voice on teamId=", teamId);
    setSelectedTeamId(teamId);
    setShowAudioChat(true);
  };

  const handleTeamClick = (teamId) => {
    setActiveTeams((prevActiveTeams) => {
      if (prevActiveTeams.includes(teamId)) {
        // 이미 활성화된 팀이면 비활성화
        return prevActiveTeams.filter((id) => id !== teamId);
      } else {
        // 활성화되지 않은 팀이면 활성화
        return [...prevActiveTeams, teamId];
      }
    });
  };

  const handleNoteClick = (teamId) => {
    navigate(`/note/${teamId}`);
  };

  const handleCanvasClick = (teamId) => {
    navigate(`/canvas/${teamId}`);
  };

  const handleKanbanBoardClick = (teamId) => {
    navigate(`/kanban-board/${teamId}`);
  };

  const handleCloseAudioChat = () => {
    setShowAudioChat(false);
  };
  
  const handleToggleSidebar = () => {
    onClose(); // 상위 컴포넌트의 토글 함수 호출
  };

  const handleJoinBoard = () => {
    navigate('/join-board');
  };

  return (
    <>
      {/* 사이드바 */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* 사이드바 내용 */}
        <div className="sidebar-content p-4">
          {/* <h2 onClick={() => navigate('/')}>ACCORD</h2> */}
          <h3>Boards</h3>
          <p onClick={() => handleJoinBoard()}>JoinBoard</p>
          <h3>Teams</h3>
          {teams.map((team) => (
            <div key={team.id}>
              <p onClick={() => handleTeamClick(team.id)} className="team-name">
                {team.teamName}
              </p>
              <div className={`team-dropdown ${activeTeams.includes(team.id) ? 'open' : ''}`}>
                <p onClick={() => handleNoteClick(team.id)}>Note</p>
                <p onClick={() => handleCanvasClick(team.id)}>Canvas</p>
                <p onClick={() => handleKanbanBoardClick(team.id)}>KanbanBoard</p>
                <p onClick={handleVoiceClick}>Voice</p>

              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          {showAudioChat && <AudioChat onClose={handleCloseAudioChat} teamId={selectedTeamId} />}
        </div>
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={handleToggleSidebar}
        className={`toggle-button ${isOpen ? 'open' : 'closed'}`}
        aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
      >
        {isOpen ? <AiOutlineLeft /> : <AiOutlineRight />}
      </button>
    </>
  );
};

export default Sidebar;