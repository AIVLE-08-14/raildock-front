// src/api/queries/chatbotQueries.ts
import { useMutation } from '@tanstack/react-query'
import { askChatbot, type ChatbotAskRequest } from '@/api/chatbotApi'

export function useAskChatbot() {
  return useMutation({
    mutationFn: (payload: ChatbotAskRequest) => askChatbot(payload),
  })
}
