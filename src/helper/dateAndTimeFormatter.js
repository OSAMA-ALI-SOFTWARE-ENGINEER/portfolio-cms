export function dateAndTimeFormatter(dateString) {
  try {
    // Handle null, undefined, or empty values
    if (!dateString) {
      return "Not available";
    }

    // Create a Date object directly from the input string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Create a formatter for date and time
    const formatter = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour time format
      timeZone: "UTC", // Ensure it interprets the date as UTC
    });

    return formatter.format(date);
  } catch (error) {
    // Don't log errors for invalid dates, just return a friendly message
    return "Not available";
  }
}
