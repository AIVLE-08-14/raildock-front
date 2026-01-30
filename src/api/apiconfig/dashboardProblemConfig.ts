// apiconfig/dashboardProblemConfig.ts
// 메인 대시보드에서 사용하는 결함(Problem) API 전용

export const DASHBOARD_PROBLEM_API = {
  TREND_COUNT: '/dashboard/problem/trend/count',
  STATUS_SUMMARY: '/dashboard/problem/status',
  RECENT_LIST: '/dashboard/problem/recent',
  CURRENT_BY_TYPE: '/dashboard/problem/current/by-type',
  GIS_LIST: '/dashboard/problem/GIS',
} as const

export const DASHBOARD_PROBLEM_QUERY_KEY = {
  all: ['dashboardProblem'] as const,

  trend: (unit: string) =>
    [...DASHBOARD_PROBLEM_QUERY_KEY.all, 'trend', unit] as const,

  status: () =>
    [...DASHBOARD_PROBLEM_QUERY_KEY.all, 'status'] as const,

  recent: () =>
    [...DASHBOARD_PROBLEM_QUERY_KEY.all, 'recent'] as const,

  currentByType: () =>
    [...DASHBOARD_PROBLEM_QUERY_KEY.all, 'currentByType'] as const,

  gis: () =>
    [...DASHBOARD_PROBLEM_QUERY_KEY.all, 'gis'] as const,
}
