// src/api/chatbotApi.ts
import axios from 'axios'

export interface ChatbotAskRequest {
  question: string
  folderFilter?: string
}

export interface RelatedReport {
  reportId: string
  folder: string
  filename: string
  riskGrade: string
  defectTypes: string
}

export interface ChatbotAskResponse {
  success: boolean
  code: string | null
  message: string
  data: {
    answer: string
    relatedReports: RelatedReport[]
    reportCount: number
  }
}

export async function askChatbot(
  payload: ChatbotAskRequest
): Promise<ChatbotAskResponse> {
  const { data } = await axios.post<ChatbotAskResponse>(
    '/api/chatbot/ask',
    payload
  )
  return data
}
