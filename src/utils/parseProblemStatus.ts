// src/utils/parseProblemStatus.ts

export type ParsedDetection = {
  target: string
  confidence: number
  description: string
}

export function parseProblemStatus(text: string): ParsedDetection[] {
  if (!text) return []

  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => {
      /**
       * 예:
       * - 애자 류 1개소 균열 파손 (신뢰도: 77.6%): 단기 파손 발전 및 사고 위험이 높습니다.
       */

      const confidenceMatch = line.match(/신뢰도:\s*([\d.]+)%/)
      const confidence = confidenceMatch ? Number(confidenceMatch[1]) : NaN

      const target = line
        .replace(/^-\s*/, '')
        .split('(신뢰도')[0]
        .trim()

      const description =
        line.split('):')[1]?.trim() ?? ''

      return {
        target,
        confidence,
        description,
      }
    })
    .filter(item => !Number.isNaN(item.confidence))
}
