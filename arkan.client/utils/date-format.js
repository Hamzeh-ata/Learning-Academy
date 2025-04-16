import { differenceInDays, format, formatDistanceToNow, formatDuration } from 'date-fns';
import { ar } from 'date-fns/locale';

export const DateFormats = {
  StandardWithTime: 'eee, MMM dd, yyyy hh:mm a',
  StandardWithoutTime: 'eee, MMM dd, yyyy',
  DateWithTime: 'MMM dd, yyyy hh:mm a',
  DateWithoutTime: 'MMM dd, yyyy',
  RawFormat: `yyyy-MM-dd`,
  TimeWithoutDate: 'hh:mm a'
};

/**
 * Formats a Date object into a formatted string with locale for ar.
 *
 * @param {Date} date - The Date object to format.
 * @param {Language} lang - The language to use for formatting the date.
 * @returns {string} The formatted date string. e.g "Feb 20, 2023 12:34PM"
 */
export const formatDateTime = (date, lang) => {
  const formatString = DateFormats.DateWithTime;
  const locale = lang === 'ar' ? ar : undefined;
  try {
    return format(date, formatString, { locale });
  } catch (err) {
    console.error(err);
    return date?.toString();
  }
};

/**
 * Formats a Date object into a formatted time string with locale for ar.
 *
 * @param {String} date - The Date object to format.
 * @param {Language} lang - The language to use for formatting the date.
 * @returns {string} The formatted time string. e.g " 12:34PM"
 */
export const formatTimeStamp = (date, lang) => {
  const formatString = DateFormats.TimeWithoutDate;
  const locale = lang === 'ar' ? ar : undefined;
  try {
    return format(new Date(date), formatString, { locale });
  } catch (err) {
    console.error(err);
    return date?.toString();
  }
};
/**
 * Formats a minutes string into a string with a specific time format and language.
 *
 * @param {startDate} Date - The Date object to format.
 * @param {endDate} Date - The Date object to format.
 * @param {Language} lang - The language to use for formatting the date.
 * @returns {string} The formatted time string, e.g. "Mar 01, 2023 at 1:55 PM - Mar 04, 2023 at 2:57 PM".
 */
export const formaDateTimeRange = (startDate, endDate, timeZone, lang) => {
  const formatString = `MMM dd, yyyy h:mm a`;
  const locale = lang === 'ar' ? ar : undefined;
  const daysDifference = differenceInDays(endDate, startDate);
  const formattedStartDate = format(startDate, formatString, { locale });
  const formattedEndDate = format(endDate, daysDifference > 0 ? formatString : 'h:mm  a', { locale });
  return `${formattedStartDate} - ${formattedEndDate}`;
};

/**
 * Formats a Date object into a string with a specific date format and language.
 *
 * @param {Date} date - The Date object to format.
 * @param {Language} lang - The language to use for formatting the date.
 * @param {DateFormats} customFormat - An enum that represents a custom format.
 * @returns {string} The formatted date string, e.g. "Feb 20, 2023".
 */
export const formatDate = (date, lang, customFormat = DateFormats.DateWithoutTime) => {
  try {
    return format(date, customFormat, { locale: lang === 'ar' ? ar : undefined });
  } catch (err) {
    console.error(err);
    return date?.toString();
  }
};

/**
 * Formats a minutes string into a string with a specific time format and language.
 *
 * @param {minutes} string - The string object to format.
 * @param {Language} lang - The language to use for formatting the date.
 * @returns {string} The formatted time string, e.g. "1 hour 2 minutes".
 */
export const humanizedTime = (minutes, lang) => {
  const locale = lang === 'ar' ? ar : undefined;

  return formatDuration(
    {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    },
    { format: ['hours', 'minutes'], locale }
  );
};

/**
 * Formats a Date object into a formatted raw date.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string. e.g "2023-03-01T13:05:00GMT+3"
 */
export const formatRawDateTime = (date) => format(date, DateFormats.RawFormat);

export function convertToFullTime(minutes) {
  const wholeMinutes = Math.floor(minutes);
  const secondsFromFraction = Math.floor((minutes - wholeMinutes) * 60);

  const hours = Math.floor(wholeMinutes / 60);
  const remainingMinutes = wholeMinutes % 60;

  // Format the time components to ensure two digits
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
  const formattedSeconds = secondsFromFraction.toString().padStart(2, '0');

  // Construct the time string based on the duration
  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} hours`;
  } else if (formattedMinutes > 0) {
    return `${formattedMinutes}:${formattedSeconds} minutes`;
  } else {
    return `${formattedSeconds} seconds`;
  }
}

export function getDateAgo(date) {
  return formatDistanceToNow(date, { addSuffix: true });
}
