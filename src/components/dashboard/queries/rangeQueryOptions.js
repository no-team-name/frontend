const rangeQueryOptions = [
  {
    label: 'Top 5 요청 많은 URL (1분 rate)',
    value: 'topk(5, sum(rate(http_server_requests_seconds_count[1m])) by (uri))',
  },
  {
    label: 'URL별 95% 응답시간 (5분 rate)',
    value:
      'histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{uri!=""}[5m])) by (le, uri))',
  },
  {
    label: 'Go: 요청 건수 (5분 rate, handler)',
    value: 'sum(rate(http_requests_total{job="go_app"}[5m])) by (handler)',
  },
  {
    label: 'Go: 응답시간 (5분, path)',
    value:
      'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="go_app"}[5m])) by (le, path))',
  },
  {
    label: 'JVM Heap (Bytes)',
    value: 'jvm_memory_used_bytes{area="heap"}',
  },
  {
    label: 'JVM GC Pause (5분)',
    value: 'sum(rate(jvm_gc_pause_seconds_sum[5m])) by (gc)',
  },
  {
    label: 'Tomcat Sessions (Created Total, 1분 rate)',
    value: 'sum(rate(tomcat_sessions_created_sessions_total[1m]))',
  },
  {
    label: 'Spring Data JPA (5분 count)',
    value: 'sum(rate(spring_data_repository_invocations_seconds_count[5m])) by (repository, method)',
  },
  {
    label: 'Node CPU 사용률(%) (고정 1분 rate)',
    value:
      '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)',
  },
  {
    label: 'HikariCP Acquire Time (95th, 1m rate)',
    value:
      'histogram_quantile(0.95, sum(rate(hikaricp_connections_acquire_seconds_bucket[1m])) by (le, pool))',
  },
];

export default rangeQueryOptions;
