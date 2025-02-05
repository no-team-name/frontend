const realTimeQueryOptions = [
  {
    label: '부하: 많이 호출되는 URL (요청 건수 상위 5)',
    value: 'topk(5, sum(rate(http_server_requests_seconds_count[TIME_RANGE])) by (uri))',
  },
  {
    label: '부하: URL별 예외 발생 건수',
    value: 'sum(rate(http_server_requests_seconds_count{exception!=""}[TIME_RANGE])) by (uri)',
  },
  {
    label: '부하: URL별 95% 응답시간',
    value:
      'histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{uri!=""}[TIME_RANGE])) by (le, uri))',
  },
  {
    label: '기능별 메트릭: 요청 건수 (function 기준)',
    value: 'sum(rate(http_server_requests_seconds_count[TIME_RANGE])) by (function)',
  },
  {
    label: 'Go 애플리케이션: 요청 건수 (handler 기준)',
    value: 'sum(rate(http_requests_total{job="go_app"}[TIME_RANGE])) by (handler)',
  },
  {
    label: 'Go 애플리케이션: 응답시간 (path 기준)',
    value:
      'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="go_app"}[TIME_RANGE])) by (le, path))',
  },
  {
    label: 'Go 애플리케이션: 처리 중인 요청 건수',
    value: 'sum(rate(http_requests_in_progress_total{job="go_app"}[TIME_RANGE])) by (handler)',
  },
  {
    label: 'JVM Heap Used (Bytes)',
    value: 'jvm_memory_used_bytes{area="heap"}',
  },
  {
    label: 'JVM GC Pauses (초)',
    value: 'sum(rate(jvm_gc_pause_seconds_sum[TIME_RANGE])) by (gc)',
  },
  {
    label: '[Node] CPU 사용률(%)',
    value:
      '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[TIME_RANGE])) * 100)',
  },
  {
    label: '[Node] 메모리 사용률(%)',
    value:
      '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
  },
  {
    label: 'Go: Goroutines',
    value: 'go_goroutines',
  },
  {
    label: 'Go: Memory Alloc Bytes',
    value: 'go_memstats_alloc_bytes',
  },
  {
    label: 'Go: GC Pause Time (avg, 1m)',
    value:
      'rate(go_gc_duration_seconds_sum[1m]) / rate(go_gc_duration_seconds_count[1m])',
  },
  {
    label: 'JVM Heap Used Bytes',
    value: 'jvm_memory_used_bytes{area="heap"}',
  },
  {
    label: 'JVM GC Pauses (초, by GC)',
    value: 'sum(rate(jvm_gc_pause_seconds_sum[TIME_RANGE])) by (gc)',
  },
  {
    label: 'JVM Threads (Live)',
    value: 'jvm_threads_live_threads',
  },
  {
    label: 'Tomcat Global Error Count',
    value: 'tomcat_global_error_total',
  },
  {
    label: 'Spring Process Uptime (초)',
    value: 'process_uptime_seconds',
  },
  {
    label: 'Spring Boot: Process CPU Usage',
    value: 'process_cpu_usage',
  },
  {
    label: 'Spring Boot: System CPU Usage',
    value: 'system_cpu_usage',
  },
  {
    label: 'Tomcat Sessions (Active)',
    value: 'tomcat_sessions_active_current_sessions',
  },
  {
    label: 'Tomcat Sessions (Created Total)',
    value: 'tomcat_sessions_created_sessions_total',
  },
  {
    label: 'HikariCP Active Connections',
    value: 'hikaricp_connections_active{pool="HikariPool-1"}',
  },
  {
    label: 'HikariCP Idle Connections',
    value: 'hikaricp_connections_idle{pool="HikariPool-1"}',
  },
  {
    label: 'HikariCP Acquire Time (95th)',
    value:
      'histogram_quantile(0.95, sum(rate(hikaricp_connections_acquire_seconds_bucket[TIME_RANGE])) by (le, pool))',
  },
  {
    label: 'Spring Data JPA (Repository calls count)',
    value:
      'sum(rate(spring_data_repository_invocations_seconds_count[TIME_RANGE])) by (repository, method)',
  },
  {
    label: 'Spring Data JPA (Repository avg time, ms)',
    value:
      '(sum(rate(spring_data_repository_invocations_seconds_sum[TIME_RANGE])) by (repository, method) / sum(rate(spring_data_repository_invocations_seconds_count[TIME_RANGE])) by (repository, method)) * 1000',
  },
  {
    label: 'RabbitMQ Connections',
    value: 'rabbitmq_connections{name="rabbit"}',
  },
];

export default realTimeQueryOptions;
