import React, { useEffect, useState } from 'react';
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

function RealTimeChart({ queryOptions, timeRangeOptions }) {
  const [selectedQuery, setSelectedQuery] = useState(queryOptions[0].value);
  const [selectedRange, setSelectedRange] = useState(timeRangeOptions[0].value);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    setTimeSeriesData([]);

    const fetchMetrics = async () => {
      const now = new Date().toLocaleTimeString();
      try {
        const baseURL = 'http://localhost:8082/gateway-actuator/api/v1/query?query=';

        // [TIME_RANGE] 부분을 치환
        let finalQuery = selectedQuery;
        if (finalQuery.includes('[TIME_RANGE]')) {
          finalQuery = finalQuery.replace('[TIME_RANGE]', `[${selectedRange}]`);
        }

        const encodedQuery = encodeURIComponent(finalQuery);
        const response = await fetch(baseURL + encodedQuery);
        const jsonData = await response.json();

        let newSeries = {};
        if (jsonData.data && jsonData.data.result) {
          jsonData.data.result.forEach((item) => {
            const label =
              item.metric.uri ||
              item.metric.function ||
              item.metric.handler ||
              item.metric.gc ||
              item.metric.instance ||
              'unknown';
            const value = parseFloat(item.value[1]);
            newSeries[label] = value;
          });
        }
        // 시계열 누적
        setTimeSeriesData((prev) => [...prev, { time: now, series: newSeries }]);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    // 5초 간격으로 폴링
    const intervalId = setInterval(fetchMetrics, 5000);
    fetchMetrics(); // 초기 1회
    return () => clearInterval(intervalId);
  }, [selectedQuery, selectedRange]);

  // 차트용 데이터 가공
  const processTimeSeriesData = (data) => {
    // data: [{ time, series: { key1: val1, key2: val2, ... } }, ...]
    const keys = new Set();
    data.forEach((item) => {
      Object.keys(item.series).forEach((k) => keys.add(k));
    });

    const times = data.map((item) => item.time);
    const datasets = Array.from(keys).map((key) => ({
      label: key,
      data: data.map((item) => item.series[key] || 0),
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      fill: false,
    }));

    return { labels: times, datasets };
  };

  const chartData = processTimeSeriesData(timeSeriesData);
  const options = {
    responsive: true,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { position: 'top' },
      title: { display: true, text: '실시간 모니터링 (Real-time)' },
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
          <label className="text-lg font-semibold text-gray-700">Period</label>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {timeRangeOptions.map((tr) => (
              <option key={tr.value} value={tr.value}>
                {tr.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Line data={chartData} options={options} />
    </div>
  );
}

export default RealTimeChart;
