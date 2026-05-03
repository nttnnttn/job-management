import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

export const formatChatTime = (dateInput: string) => {
  if (!dateInput) return '';
  
  // Handle both Date objects and ISO strings from MongoDB
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;

  if (isToday(date)) {
    return format(date, 'p'); // '10:30 AM'
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  if (isThisWeek(date)) {
    return format(date, 'EEEE'); // 'Monday', 'Tuesday', etc.
  }

  // For older dates
  return format(date, 'MMM d'); // 'May 3'
};
