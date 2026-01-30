import type { ProblemTypeDistributionItem } from '@/types/dashboardProblem'

export interface ProblemBarChartItem {
  key: string
  count: number
  group: 'RAIL' | 'INSULATOR' | 'NEST'
  isGroup: boolean
}

export function mapMonthlyProblemBarData(
  data: ProblemTypeDistributionItem[] = []
): ProblemBarChartItem[] {
  const getCount = (key: string) =>
    data.find(d => d.key === key)?.count ?? 0

  return [
    // ===== 선로 =====
    {
      key: '선로(전체)',
      count: getCount('훼손') + getCount('너트 풀림'),
      group: 'RAIL',
      isGroup: true,
    },
    {
      key: '훼손',
      count: getCount('훼손'),
      group: 'RAIL',
      isGroup: false,
    },
    {
      key: '너트 풀림',
      count: getCount('너트 풀림'),
      group: 'RAIL',
      isGroup: false,
    },

    // ===== 애자 =====
    {
      key: '애자(전체)',
      count:
        getCount('균열 파손') +
        getCount('이탈') +
        getCount('마모 등') +
        getCount('탈락') +
        getCount('파손') +
        getCount('마모 커버 탈락'),
      group: 'INSULATOR',
      isGroup: true,
    },
    { key: '균열 파손', count: getCount('균열 파손'), group: 'INSULATOR', isGroup: false },
    { key: '이탈', count: getCount('이탈'), group: 'INSULATOR', isGroup: false },
    { key: '마모 등', count: getCount('마모 등'), group: 'INSULATOR', isGroup: false },
    { key: '탈락', count: getCount('탈락'), group: 'INSULATOR', isGroup: false },
    { key: '파손', count: getCount('파손'), group: 'INSULATOR', isGroup: false },
    {
      key: '마모 커버 탈락',
      count: getCount('마모 커버 탈락'),
      group: 'INSULATOR',
      isGroup: false,
    },

    // ===== 둥지 =====
    {
      key: '탐지',
      count: getCount('탐지'),
      group: 'NEST',
      isGroup: true,
    },
  ]
}
