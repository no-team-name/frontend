import React, { useRef, useEffect, useState } from 'react';
import './LogoCarousel.css';
import consulLogo from '../../assets/consulio.svg';
import rabbitMqLogo from '../../assets/rabbitmq.svg';
import reactLogo from '../../assets/reactjs.svg';
import redisLogo from '../../assets/redis.svg';
import prometheusLogo from '../../assets/prometheusio.svg';
import grafanaLogo from '../../assets/grafana.svg';


const logos = [
  { alt: 'React', src: reactLogo },
  { alt: 'Redis', src: redisLogo },
  { alt: 'Prometheus', src: prometheusLogo },
  { alt: 'Spring', src: 'https://cdn.svgporn.com/logos/spring.svg' },
  { alt: 'Java', src: 'https://cdn.svgporn.com/logos/java.svg' },
  { alt: 'JavaScript', src: 'https://cdn.svgporn.com/logos/javascript.svg' },
  { alt: 'Go', src: 'https://cdn.svgporn.com/logos/go.svg' },
  { alt: 'gRPC', src: 'https://cdn.svgporn.com/logos/grpc.svg' },
  { alt: 'Grafana', src: grafanaLogo },
  { alt: 'AWS', src: 'https://cdn.svgporn.com/logos/aws.svg' },
  { alt: 'MariaDB', src: 'https://cdn.svgporn.com/logos/mariadb.svg' },
  { alt: 'MongoDB', src: 'https://cdn.svgporn.com/logos/mongodb.svg' },
  { alt: 'RabbitMQ', src: rabbitMqLogo },
  { alt: 'Consul', src: consulLogo }
];

const LogoCarousel = () => {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateTrackWidth);
    });

    const updateTrackWidth = () => {
      const firstItem = track.children[0];
      if (!firstItem) return;

      const itemWidth = firstItem.offsetWidth;
      const itemMargin = parseFloat(getComputedStyle(firstItem).marginRight) * 2;
      const singleWidth = itemWidth + itemMargin;
      
      // 3세트 렌더링으로 자연스러운 연결 보장
      track.style.width = `${singleWidth * logos.length * 3}px`;
    };

    // 초기 설정
    updateTrackWidth();
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="logo-carousel">
      <div className="logo-track" ref={trackRef}>
        {[...Array(3)].map((_, set) => ( // 3세트 렌더링
          logos.map((logo, index) => (
            <div 
              key={`${set}-${index}`} 
              className="logo-item"
            >
              <img {...logo} className="logo-image" />
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;