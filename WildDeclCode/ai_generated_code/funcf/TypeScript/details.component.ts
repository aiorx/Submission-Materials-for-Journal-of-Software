marketOpen():boolean {
    const now = new Date(); // Current date and time
    const dayOfWeek = now.getDay(); // Day of the week, where 0 is Sunday and 6 is Saturday

    // Check if today is a weekday (Monday=1, ..., Friday=5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const startOfWorkday = new Date(); // Today's date but at the start of the workday
        const endOfWorkday = new Date(); // Today's date but at the end of the workday

        // Set the start of the workday (6:30 AM)
        startOfWorkday.setHours(6, 0, 0, 0); // Hours, Minutes, Seconds, Milliseconds

        // Set the end of the workday (1:30 PM)
        endOfWorkday.setHours(13, 0, 0, 0); // Note: 13 = 1 PM in 24-hour time

        // Check if current time is within the workday hours
        return now >= startOfWorkday && now <= endOfWorkday;
    } else {
        // It's not a weekday
        return false;
    }
  }