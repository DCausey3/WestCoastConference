export function getFifthSundayMeeting(year: number, month: number): Date | null {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const sundays: number[] = [];
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        const date = new Date(year, month, d);
        if (date.getDay() === 0) sundays.push(d);
    }
    if (sundays.length < 5) return null;
    const saturdayBefore = new Date(year, month, sundays[4] - 1);
    return saturdayBefore;
}

export function getUpcomingQuarterlyMeeting(from: Date = new Date()): Date | null {
    let year = from.getFullYear();
    let month = from.getMonth();
    for (let i = 0; i < 24; i++) {
        const meeting = getFifthSundayMeeting(year, month);
        if (meeting && meeting >= from) return meeting;
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
    }
    return null;
}