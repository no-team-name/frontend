import React, { useRef } from 'react';

const TeamMemberCard = ({ imageUrl, memberName, github, email }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const { offsetX: x, offsetY: y } = e.nativeEvent;
    const rotateY = -1 / 5 * x + 20;
    const rotateX = 4 / 30 * y - 20;

    overlay.style.backgroundPosition = `${x / 5 + y / 5}%`;
    overlay.style.filter = `opacity(${x / 200}) brightness(1.2)`;

    container.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseOut = () => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    overlay.style.filter = 'opacity(0)';
    container.style.transform = 'perspective(350px) rotateY(0deg) rotateX(0deg)';
  };

  const handleCardClick = () => {
    if (github) {
      window.open(github, '_blank');
    }
  };

  return (
    <div
      ref={containerRef}
      className="container"
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      onClick={handleCardClick}
      style={{
        width: '340px',
        height: '475px',
        transition: 'all 0.1s',
        position: 'relative',
        transform: 'translateZ(0)',
      }}
    >
      <div
        ref={overlayRef}
        className="overlay"
        style={{
          position: 'absolute',
          width: '340px',
          height: '475px',
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 219, 112, 0.8) 45%, rgba(132, 50, 255, 0.6) 50%, transparent 54%)',
          filter: 'brightness(1.1) opacity(0.8)',
          mixBlendMode: 'color-dodge',
          backgroundSize: '150% 150%',
          backgroundPosition: '100%',
          transition: 'all 0.1s',
        }}
      ></div>
      <div
        className="card"
        style={{
          width: '340px',
          height: '475px',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
        }}
      ></div>
      {/* 반투명 설명 칸 */}
      <div
        className="info-box"
        style={{
          position: 'absolute',
          top: '82%',
          width: '100%',
          padding: '10px',
          textAlign: 'center',
          color: '#000',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{memberName}</div>
        <div>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            {github}
          </a>
        </div>
        <div>{email}</div>
      </div>
    </div>
  );
};

export default TeamMemberCard;