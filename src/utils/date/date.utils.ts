export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Check if it's within the last 24 hours
  if (diffInHours < 24) {
    return "Today";
  }

  // Check if it's yesterday (24-48 hours ago)
  if (diffInHours < 48) {
    return "Yesterday";
  }

  // For everything else
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 14) {
    return "1 week ago";
  } else if (diffInDays < 21) {
    return "2 weeks ago";
  } else if (diffInDays < 28) {
    return "3 weeks ago";
  } else if (diffInDays < 60) {
    return "1 month ago";
  } else if (diffInDays < 90) {
    return "2 months ago";
  } else if (diffInDays < 120) {
    return "3 months ago";
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} months ago`;
  } else if (diffInDays < 730) {
    return "1 year ago";
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} years ago`;
  }
}
