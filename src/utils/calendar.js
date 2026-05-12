export const addToGoogleCalendar = (title, description, dateStr) => {
  if (!dateStr) return;
  
  const date = new Date(dateStr);
  
  // Set the reminder for 9:00 AM local time on the given date
  date.setHours(9, 0, 0, 0);
  
  const pad = (n) => (n < 10 ? '0' + n : n);
  
  // Convert to UTC string for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatGoogleDate = (d) => {
    return d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) + 'Z';
  };

  const start = formatGoogleDate(date);
  // End 1 hour later
  const endDate = new Date(date.getTime() + 60 * 60 * 1000);
  const end = formatGoogleDate(endDate);

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', title);
  url.searchParams.append('dates', `${start}/${end}`);
  url.searchParams.append('details', description);

  window.open(url.toString(), '_blank');
};
