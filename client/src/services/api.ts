import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})


let onSessionExpired: (() => void) | null = null


export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  onSessionExpired = handler
}

let onServerActivity: (() => void) | null = null

export const setServerActivityHandler = (handler: (() => void) | null) => {
  onServerActivity = handler
}

api.interceptors.response.use(
  (response) => {
    onServerActivity?.()
    return response
  },
  (error) => {
    if (error.response?.data?.code === 'SESSION_EXPIRED') {
      onSessionExpired?.()
    }
    return Promise.reject(error)
  },
)
export default api