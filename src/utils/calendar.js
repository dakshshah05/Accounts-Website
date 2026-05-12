export const generateICS = (title, description, dateStr) => {
  if (!dateStr) return;
  
  const date = new Date(dateStr);
  
  // Set the reminder for 9:00 AM local time on the given date
  date.setHours(9, 0, 0, 0);
  
  const pad = (n) => (n < 10 ? '0' + n : n);
  
  // Convert to UTC string for ICS
  const formatICSDate = (d) => {
    return d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) + 'Z';
  };

  const start = formatICSDate(date);
  // End 1 hour later
  const endDate = new Date(date.getTime() + 60 * 60 * 1000);
  const end = formatICSDate(endDate);

  // Clean strings
  const cleanTitle = title.replace(/,/g, '\\,').replace(/;/g, '\\;');
  const cleanDesc = description.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FamilyVault//EN
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${cleanTitle}
DESCRIPTION:${cleanDesc}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
