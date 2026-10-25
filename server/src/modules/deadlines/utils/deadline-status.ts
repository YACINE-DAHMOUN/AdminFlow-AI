
export const computeDeadlineStatus = (deadlineDate: Date) => {
    const now = new Date()
    const in7Days = new Date(now)
    in7Days.setDate(now.getDate() + 7)
    return deadlineDate >= now && deadlineDate <= in7Days
        ? 'URGENT'
        : deadlineDate < now
            ? 'OVERDUE'
            : 'PENDING'
}
