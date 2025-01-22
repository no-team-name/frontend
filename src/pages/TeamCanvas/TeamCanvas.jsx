import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CanvasToolbar from '../../components/canvas/CanvasToolbar';
import './TeamCanvas.css';
import NoteHeader from '../../components/common/NoteHeader';
import CanvasArea from '../../components/canvas/CanvasArea';
import Sidebar from '../../components/common/Sidebar';
import CanvasTabs from '../../components/canvas/CanvasTabs';
import { getCanvasByTeamID, getCanvasByID } from '../../service/CanvasService';

import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { Awareness } from 'y-protocols/awareness';

const TeamCanvas = () => {
  const { teamId } = useParams();
  const [tool, setTool] = useState('pencil');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const canvasAreaRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [image, setImage] = useState(null);

  const yDoc = useRef(new Y.Doc());
  const provider = useRef(null);
  const awareness = useRef(new Awareness(yDoc.current));

  useEffect(() => {
    const roomName = `canvas-${teamId}`;
    if (!roomName || typeof roomName !== 'string' || roomName.trim() === '') {
      console.error('Invalid room name:', roomName);
      return;
    }

    // WebRTC provider 설정
    provider.current = new WebrtcProvider(roomName, yDoc.current, {
      signaling: [`ws://localhost:4444`],
      awareness: awareness.current,
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:127.0.0.1:3478",
          username: "user",
          credential: "pass",
        },
      ],
    });


    // 랜덤 사용자 정보 생성
    const user = {
      name: `User ${Math.floor(Math.random() * 100)}`,
      color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
    };

    provider.current.awareness.setLocalStateField('user', {
      name: user.name,
      color: user.color
    });

    const initialTabs = async () => {
      try {
        const canvases = await getCanvasByTeamID(teamId);
        const tabsData = canvases.map(canvas => ({
          id: canvas.id,
          title: canvas.title,
          shapes: JSON.parse(canvas.canvas || '[]')
        }));
        setTabs(tabsData);
      } catch (error) {
        console.error('Error fetching canvas data:', error);
      }
    };

    initialTabs();

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (provider.current) {
        provider.current.destroy();
      }
      yDoc.current.destroy();
    };
  }, [teamId]);  

  const handleTabClick = async (index) => {
    setActiveTab(index);
    const selectedTab = tabs[index];
    const yShapes = yDoc.current.getArray('shapes');

    if (!selectedTab.id) {
      // 아이디가 없는 경우 빈 캔버스를 출력
      yShapes.delete(0, yShapes.length);
      yShapes.push([]);
      return;
    }

    try {
      const canvasData = await getCanvasByID(selectedTab.id);
      const shapes = JSON.parse(canvasData.canvas || '[]');
      const processedShapes = await Promise.all(shapes.map(async shape => {
        if (shape.tool === 'image' && shape.imageUrl) {
          return new Promise(resolve => {
            const image = new window.Image();
            image.src = shape.imageUrl;
            image.onload = () => {
              resolve({ ...shape, image });
            };
          });
        }
          return shape;
      }));
      console.log('Processed shapes:', processedShapes);
      yShapes.delete(0, yShapes.length);
      yShapes.push(processedShapes);
    } catch (error) {
      console.error('Error fetching canvas data:', error);
    }
  };

  const handleZoom = (newScale) => {
    const newCanvasSize = {
      width: window.innerWidth * newScale,
      height: window.innerHeight * newScale,
    };
    setCanvasSize(newCanvasSize);
  };

  const handleSelectTool = (selectedTool) => {
    setTool(selectedTool);
  };

  const handleSave = async () => {
    if (canvasAreaRef.current) {
      const response = await canvasAreaRef.current.saveCanvas();
      console.log('Save response:', response);
      if (response && response.id) {
        setTabs(tabs.map((tab, index) => 
          index === activeTab ? { ...tab, id: response.id } : tab
        ));
      }
    }
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUpdateTitle = (id, newTitle) => {
    setTabs(tabs.map(tab => (tab.id === id ? { ...tab, title: newTitle } : tab)));
  };

  const handleDeleteTab = (id) => {
    setTabs(tabs.filter(tab => tab.id !== id));
    if (activeTab >= tabs.length - 1) {
      setActiveTab(tabs.length - 2);
    }
  };

  const handleAddTab = () => {
    const newTab = {
      id: ``,
      title: 'Untitled',
      shapes: []
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
    const yShapes = yDoc.current.getArray('shapes');
    yShapes.delete(0, yShapes.length);
    yShapes.push([]);
  };

  const handleImageUpload = (imageData) => {
    console.log('Uploaded image data:', imageData);
    setImage(imageData);
  };  

  return (
    <div className={`TeamCanvas ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NoteHeader onBack={() => {}} onShare={() => {}} onChat={() => {}} onMenu={handleMenuClick} onSave={handleSave} />
      <CanvasTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabClick={handleTabClick} 
        onUpdateTitle={handleUpdateTitle} 
        onDeleteTab={handleDeleteTab}
        onAddTab={handleAddTab}
      />
      <CanvasToolbar className="CanvasToolbar" onSelectTool={handleSelectTool} onImageUpload={handleImageUpload} />
      <CanvasArea 
        ref={canvasAreaRef} 
        tool={tool} 
        teamId={teamId} 
        yDoc={yDoc.current} 
        provider={provider.current} 
        awareness={awareness.current} 
        onZoom={handleZoom} 
        canvasSize={canvasSize} 
        canvasId={tabs[activeTab]?.id} 
        title={tabs[activeTab]?.title}
        image={image}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={handleMenuClick} />
    </div>
  );
};

export default TeamCanvas;