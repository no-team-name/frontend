
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import MainHeader from '../../components/common/MainHeader';

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
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  // 기존: 부하, 예외, 응답속도, 기능별 메트릭 데이터를 저장
  const [loadData, setLoadData] = useState([]);
  const [exceptionData, setExceptionData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [functionMetricsData, setFunctionMetricsData] = useState([]);
  // 추가: Go 애플리케이션의 요청 건수(또는 기타 메트릭) 데이터를 저장
  const [goRequestData, setGoRequestData] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const now = new Date().toLocaleTimeString();
      // 모든 요청은 Gateway Actuator를 통해 전송
      const baseURL = 'http://localhost:8082/gateway-actuator/api/v1/query?query=';

      // 1. 부하: 많이 호출되는 URL (요청 건수 상위 5)
      try {
        const loadQuery = 'topk(5, sum(rate(http_server_requests_seconds_count[1m])) by (uri))';
        const loadResponse = await fetch(baseURL + encodeURIComponent(loadQuery));
        const loadJson = await loadResponse.json();
        let loadSeries = {};
        if (loadJson.data && loadJson.data.result) {
          loadJson.data.result.forEach(item => {
            const uri = item.metric.uri || 'unknown';
            const value = parseFloat(item.value[1]);
            loadSeries[uri] = value;
          });
        }
        setLoadData(prev => [...prev, { time: now, series: loadSeries }]);
      } catch (error) {
        console.error('Error fetching load metrics:', error);
      }

      // 2. 부하: URL별 예외 발생 건수
      try {
        const exceptionQuery = 'sum(rate(http_server_requests_seconds_count{exception!=""}[1m])) by (uri)';
        const excResponse = await fetch(baseURL + encodeURIComponent(exceptionQuery));
        const excJson = await excResponse.json();
        let excSeries = {};
        if (excJson.data && excJson.data.result) {
          excJson.data.result.forEach(item => {
            const uri = item.metric.uri || 'unknown';
            const value = parseFloat(item.value[1]);
            excSeries[uri] = value;
          });
        }
        setExceptionData(prev => [...prev, { time: now, series: excSeries }]);
      } catch (error) {
        console.error('Error fetching exception metrics:', error);
      }

      // 3. 부하: URL별 95% 응답시간
      try {
        // uri 라벨이 존재하는 데이터만 필터링
        const responseTimeQuery = 'histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{uri!=""}[1m])) by (le, uri))';
        const respResponse = await fetch(baseURL + encodeURIComponent(responseTimeQuery));
        const respJson = await respResponse.json();
        let respSeries = {};
        if (respJson.data && respJson.data.result) {
          respJson.data.result.forEach(item => {
            const uri = item.metric.uri || 'unknown';
            const value = parseFloat(item.value[1]);
            respSeries[uri] = value;
          });
        }
        setResponseTimeData(prev => [...prev, { time: now, series: respSeries }]);
      } catch (error) {
        console.error('Error fetching response time metrics:', error);
      }

      // 4. 기능별 메트릭: 요청 건수 (function 기준)
      try {
        const functionQuery = 'sum(rate(http_server_requests_seconds_count[1m])) by (function)';
        const funcResponse = await fetch(baseURL + encodeURIComponent(functionQuery));
        const funcJson = await funcResponse.json();
        let funcSeries = {};
        if (funcJson.data && funcJson.data.result) {
          funcJson.data.result.forEach(item => {
            const funcName = item.metric.function || 'unknown';
            const value = parseFloat(item.value[1]);
            funcSeries[funcName] = value;
          });
        }
        setFunctionMetricsData(prev => [...prev, { time: now, series: funcSeries }]);
      } catch (error) {
        console.error('Error fetching function metrics:', error);
      }

      // 5. Go 애플리케이션: 요청 건수 (예: handler별)
      try {
        // Go 애플리케이션의 메트릭은 job="go_app" 라벨과 handler 등으로 구분한다고 가정
        // 메트릭 이름은 일반적으로 go용으로 http_requests_total을 많이 사용함
        const goQuery = 'sum(rate(http_requests_total{job="go_app"}[1m])) by (handler)';
        const goResponse = await fetch(baseURL + encodeURIComponent(goQuery));
        const goJson = await goResponse.json();
        let goSeries = {};
        if (goJson.data && goJson.data.result) {
          goJson.data.result.forEach(item => {
            const handler = item.metric.handler || 'unknown';
            const value = parseFloat(item.value[1]);
            goSeries[handler] = value;
          });
        }
        setGoRequestData(prev => [...prev, { time: now, series: goSeries }]);
      } catch (error) {
        console.error('Error fetching Go request metrics:', error);
      }
    };

    const interval = setInterval(fetchMetrics, 5000);
    fetchMetrics(); // 초기 호출
    return () => clearInterval(interval);
  }, []);

  // 공통: 여러 시리즈 데이터를 하나의 차트에 나타내기 위해 재구성하는 함수
  const processTimeSeriesData = (data) => {
    // data: [{ time, series: { key: value, ... } }, ...]
    const keys = new Set();
    data.forEach(item => {
      Object.keys(item.series).forEach(k => keys.add(k));
    });
    const times = data.map(item => item.time);
    const datasets = Array.from(keys).map(key => ({
      label: key,
      data: data.map(item => item.series[key] || 0),
      // 간단한 랜덤 색상 (원하는 색상으로 직접 지정 가능)
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      fill: false,
    }));
    return { labels: times, datasets };
  };

  const loadChartData = processTimeSeriesData(loadData);
  const exceptionChartData = processTimeSeriesData(exceptionData);
  const responseTimeChartData = processTimeSeriesData(responseTimeData);
  const functionChartData = processTimeSeriesData(functionMetricsData);
  const goChartData = processTimeSeriesData(goRequestData);

  const options = {
    responsive: true,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { position: 'top' },
      title: { display: true, text: '실시간 모니터링' },
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return (
    <div>
        <MainHeader title="실시간 모니터링 대시보드" />
      <h2>실시간 모니터링 대시보드 (Gateway Actuator)</h2>

      <div style={{ marginBottom: '50px' }}>
        <h3>부하: 많이 호출되는 URL (요청 건수)</h3>
        <Line data={loadChartData} options={options} />
      </div>

      <div style={{ marginBottom: '50px' }}>
        <h3>부하: URL별 예외 발생 건수</h3>
        <Line data={exceptionChartData} options={options} />
      </div>

      <div style={{ marginBottom: '50px' }}>
        <h3>부하: URL별 95% 응답시간</h3>
        <Line data={responseTimeChartData} options={options} />
      </div>

      <div style={{ marginBottom: '50px' }}>
        <h3>기능별 메트릭: 요청 건수 (function 기준)</h3>
        <Line data={functionChartData} options={options} />
      </div>

      <div style={{ marginBottom: '50px' }}>
        <h3>Go 애플리케이션: 요청 건수 (handler 기준)</h3>
        <Line data={goChartData} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
