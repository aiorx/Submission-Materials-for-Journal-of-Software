```typescript
public getDaysLeftUntilDate(dateStr: string): number {
    // Split the input date string into year, month, and day components
    const [year, month, day] = dateStr.split('-').map(Number);

    // Get the current date
    const currentDate = new Date();

    // Create a new Date object for the target date, adjusting month (0-based) and day
    const targetDate = new Date(year, month - 1, day)

    // Calculate the time difference in milliseconds
    const timeDifference = targetDate.getTime() - currentDate.getTime();

    // Calculate the number of days left
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return daysLeft;
}
```