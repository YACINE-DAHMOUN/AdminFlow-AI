import type { DeadlineStatus } from '../types/deadline.types'

export const ACTIVE_STATUSES: DeadlineStatus[] = ['PENDING', 'URGENT', 'OVERDUE']
export const isActive = (status: DeadlineStatus) => ACTIVE_STATUSES.includes(status)
