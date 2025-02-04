import React, { useEffect, useState } from 'react';
import MainHeader from '../../components/common/MainHeader';
import './DashBoard.css';
import ChartTab from '../../components/dashboard/ChartTab';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const timeRangeOptions = [
    { label: '1분', value: '1m' },
    { label: '5분', value: '5m' },
    { label: '15분', value: '15m' },
    { label: '1시간', value: '1h' },
    { label: '6시간', value: '6h' },
    { label: '12시간', value: '12h' },
    { label: '1일(24h)', value: '1d' },
    { label: '7일(1주)', value: '7d' },
  ];

  return (
    <div>
      <MainHeader title="실시간 모니터링 대시보드" />
      <div className="dashboard-container" onSidebarToggle={handleSidebarToggle} >
        <ChartTab
          timeRangeOptions={timeRangeOptions}
        />
      </div>
    </div>
  );
}

export default Dashboard;
