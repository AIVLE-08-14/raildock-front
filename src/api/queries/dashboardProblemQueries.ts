// src/api/queries/dashboardProblemQueries.ts

import { useQuery } from '@tanstack/react-query'
import { dashboardProblemApi } from '@/api/dashboardProblemApi'
import {
  DASHBOARD_PROBLEM_QUERY_KEY,
} from '@/api/apiconfig/dashboardProblemConfig'
import type { TrendUnit } from '@/types/dashboardProblem'

/**
 * 결함 카운트 추이
 */
export const useDashboardProblemTrend = (unit: TrendUnit) =>
  useQuery({
    queryKey: DASHBOARD_PROBLEM_QUERY_KEY.trend(unit),
    queryFn: async () => {
      const res = await dashboardProblemApi.getTrendCount(unit)
      return res.data
    },
  })

/**
 * 결함 상태 요약
 */
export const useDashboardProblemStatus = () =>
  useQuery({
    queryKey: DASHBOARD_PROBLEM_QUERY_KEY.status(),
    queryFn: async () => {
      const res = await dashboardProblemApi.getStatusSummary()
      return res.data
    },
  })

/**
 * 최근 결함 목록
 */
export const useDashboardRecentProblems = () =>
  useQuery({
    queryKey: DASHBOARD_PROBLEM_QUERY_KEY.recent(),
    queryFn: async () => {
      const res = await dashboardProblemApi.getRecentList()
      return res.data
    },
  })

/**
 * 이번 달 결함 타입 분포
 */
export const useDashboardProblemByType = () =>
  useQuery({
    queryKey: DASHBOARD_PROBLEM_QUERY_KEY.currentByType(),
    queryFn: async () => {
      const res = await dashboardProblemApi.getCurrentByType()
      return res.data
    },
  })

/**
 * GIS용 결함 목록
 */
export const useDashboardProblemGis = () =>
  useQuery({
    queryKey: DASHBOARD_PROBLEM_QUERY_KEY.gis(),
    queryFn: async () => {
      const res = await dashboardProblemApi.getGisList()
      return res.data
    },
  })
