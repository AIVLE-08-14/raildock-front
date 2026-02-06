// utils/problemSummary.ts
import type { ProblemDetail } from '@/types/problem'

export function buildProblemSummary(problem: ProblemDetail) {
  return {
    type: problem.problemType,
    severity: problem.severity,
    detectedAt: new Date(problem.detectedTime).toLocaleString(),
    hasRecommendedActions: Boolean(problem.recommendedActions),
  }
}
