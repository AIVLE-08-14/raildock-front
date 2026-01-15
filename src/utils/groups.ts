// utils/group.ts

/**
 * 배열의 값들을 기준으로 개수를 집계하는 유틸 함수
 * 예) ["A", "B", "A"] → { A: 2, B: 1 }
 *
 * @typeParam T - string 또는 number 타입만 허용 (객체 키로 사용되기 때문)
 * @param arr - 집계 대상 배열
 * @returns 각 값별 등장 횟수를 담은 객체
 */
export function groupCount<T extends string | number>(
  arr: T[]
): Record<T, number> {
  return arr.reduce((acc, cur) => {
    // 현재 값(cur)을 키로 사용해 개수 누적
    acc[cur] = (acc[cur] ?? 0) + 1
    return acc
  }, {} as Record<T, number>) // 초기값은 빈 객체
}
// 메인화면 좌측 그래프 더미데이터 만들때 사용한 것. 실제 데이터 들어온다면 삭제해도 됨.