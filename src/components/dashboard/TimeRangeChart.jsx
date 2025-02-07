import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TimeRangeChart({ queryOptions }) {
  const [selectedQuery, setSelectedQuery] = useState(queryOptions[0].value);
  // 예시: datetime-local input
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [step, setStep] = useState('60'); // 60초 간격
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handleFetchRangeData = async () => {
    try {
      const startTs = Math.floor(new Date(startTime).getTime() / 1000);
      const endTs = Math.floor(new Date(endTime).getTime() / 1000);

      const baseURL = 'http://localhost:8082/gateway-actuator/api/v1/query_range?query=';
      const encodedQuery = encodeURIComponent(selectedQuery);
      const url = `${baseURL}${encodedQuery}&start=${startTs}&end=${endTs}&step=${step}`;

      const resp = await fetch(url);
      const jsonData = await resp.json();

      if (!jsonData.data || !jsonData.data.result) {
        console.error('No data returned for range query', jsonData);
        return;
      }

      // 결과 parsing
      const allResults = jsonData.data.result;
      // allResults: [ { metric: {...}, values: [[ts, val], ...] }, ... ]
      const uniqueTimestamps = new Set();
      allResults.forEach((r) => {
        r.values.forEach(([ts]) => uniqueTimestamps.add(ts));
      });
      const sortedTs = [...uniqueTimestamps].sort((a, b) => a - b);

      const datasets = allResults.map((seriesObj, idx) => {
        const metric = seriesObj.metric;
        const label =
          metric.path ||
          metric.uri ||
          metric.function ||
          metric.handler ||
          metric.gc ||
          metric.instance ||
          `series-${idx}`;

        // Map으로 {ts -> value} 변환
        const valuesMap = new Map(
          seriesObj.values.map(([ts, val]) => [ts, parseFloat(val)])
        );

        // sortedTs 순서대로 data 배열
        const dataArr = sortedTs.map((t) => valuesMap.get(t) || 0);

        return {
          label,
          data: dataArr,
          borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
          fill: false,
        };
      });

      // 타임스탬프를 보기 좋은 시각 형식으로 변환
      const labelStrings = sortedTs.map((t) =>
        new Date(t * 1000).toLocaleTimeString()
      );

      setChartData({ labels: labelStrings, datasets });
    } catch (error) {
      console.error('Error fetching range data:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { position: 'top' },
      title: { display: true, text: '기간별 모니터링 (Time Range)' },
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return (
    <div>
      <div className="mb-5 flex space-x-4 justify-center items-center">
        <div className="flex items-center space-x-2">
          <label className="text-lg font-semibold text-gray-700">Indicator</label>
          <select
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {queryOptions.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-lg font-semibold text-gray-700">Start</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-lg font-semibold text-gray-700">End</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-lg font-semibold text-gray-700">Step (seconds)</label>
          <input
            type="text"
            value={step}
            onChange={(e) => setStep(e.target.value)}
            className="mt-1 block w-20 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          onClick={handleFetchRangeData}
          className="mt-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition"
        >
          Search
        </button>
      </div>

      <Line data={chartData} options={options} />
    </div>
  );
}

export default TimeRangeChart;
