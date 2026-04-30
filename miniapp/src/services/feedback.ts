import { request } from './request'

export type FeedbackPayload = {
  content: string
  contact?: string
}

export function submitFeedback(payload: FeedbackPayload) {
  return request<null>('/feedbacks', {
    method: 'POST',
    data: payload,
  })
}
