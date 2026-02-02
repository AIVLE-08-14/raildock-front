// src/api/apiconfig/problemConfig.ts

export const PROBLEM_API = {
  BASE: '/problems',

  LIST: () => '/problems',
  DETAIL: (id: string) => `/problems/${id}`,
  DELETE: (id: string) => `/problems/${id}`,
  UPDATE: (id: string) => `/problems/${id}`,
  UPDATE_STATUS: (id: string) => `/problems/${id}/status`,
  UPDATE_MANAGER: (id: string) => `/problems/${id}/manager`,
}
