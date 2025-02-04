import React, { useState } from 'react';
import RealTimeChart from './RealTimeChart';
import TimeRangeChart from './TimeRangeChart';
import realTimeQueryOptions from './queries/realTimeQueryOptions';
import rangeQueryOptions from './queries/rangeQueryOptions';

function ChartTab({ timeRangeOptions }) {
  const [activeTab, setActiveTab] = useState('realtime');

  return (
    <div>
      {/* 탭 버튼 */}
      <div className="mb-5 flex space-x-4 justify-center">
        <button
          onClick={() => setActiveTab('realtime')}
          className={`px-6 py-3 text-lg font-semibold rounded-full ${activeTab === 'realtime' ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 transition`}
        >
          Real-time
        </button>
        <button 
          onClick={() => setActiveTab('timerange')}
          className={`px-6 py-3 text-lg font-semibold rounded-full ${activeTab === 'timerange' ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 transition`}
        >
          Time Range
        </button>
      </div>

      {/* 탭별 컴포넌트 표시 */}
      {activeTab === 'realtime' && (
        <RealTimeChart
          queryOptions={realTimeQueryOptions}
          timeRangeOptions={timeRangeOptions}
        />
      )}
      {activeTab === 'timerange' && (
        <TimeRangeChart
          queryOptions={rangeQueryOptions}
        />
      )}
    </div>
  );
}

export default ChartTab;
