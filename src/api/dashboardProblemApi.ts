// src/api/dashboardProblemApi.ts

import { apiClient } from '@/api/client'
import {
  DASHBOARD_PROBLEM_API,
} from '@/api/apiconfig/dashboardProblemConfig'
import type {
  TrendUnit,
  ProblemTrendResponse,
  ProblemStatusSummaryResponse,
  RecentProblemResponse,
  ProblemTypeDistributionResponse,
  GisProblemResponse,
} from '@/types/dashboardProblem'

/**
 * Dashboard - Problem API
 */
export const dashboardProblemApi = {
  /**
   * 결함 카운트 추이
   */
  getTrendCount(unit: TrendUnit) {
    return apiClient.get<ProblemTrendResponse>(
      DASHBOARD_PROBLEM_API.TREND_COUNT,
      { params: { unit } }
    )
  },

  /**
   * 결함 상태 요약
   */
  getStatusSummary() {
    return apiClient.get<ProblemStatusSummaryResponse>(
      DASHBOARD_PROBLEM_API.STATUS_SUMMARY
    )
  },

  /**
   * 최근 결함 목록 (10건)
   */
  getRecentList() {
    return apiClient.get<RecentProblemResponse>(
      DASHBOARD_PROBLEM_API.RECENT_LIST
    )
  },

  /**
   * 이번 달 결함 타입 분포
   */
  getCurrentByType() {
    return apiClient.get<ProblemTypeDistributionResponse>(
      DASHBOARD_PROBLEM_API.CURRENT_BY_TYPE
    )
  },

  /**
   * GIS용 결함 전체 조회
   */
  getGisList() {
    return apiClient.get<GisProblemResponse>(
      DASHBOARD_PROBLEM_API.GIS_LIST
    )
  },
}
