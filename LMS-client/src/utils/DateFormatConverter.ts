export const convertToTime = (dateString: string) => {
    // Try to create a new Date object from the provided string
    const date: any = new Date(dateString);

    // Check if the date is invalid
    if (isNaN(date)) {
        throw new Error("Invalid date format");
    }

    // Extract the hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    // Format minutes to always have two digits
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    return formattedTime;
}

export function converToDate(date: Date | string) {
    // Ensure the date is a valid Date object
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    const year = d.getFullYear(); // Get the full year

    return `${day}/${month}/${year}`;
}

export function getDayFromDate(date: Date) {
    // Array of day names to map the day number to a name
    const daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    // Get the day of the week (0-6) and return the corresponding day name
    const dayName = daysOfWeek[date.getDay()];

    return dayName;
}









