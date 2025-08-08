/**
 * Handles Django's microsecond-precision datetime strings
 * Example: "2025-05-27T12:50:40.441106Z"
 */

type DjangoDateTime = string;

export const formatDjangoDateTime = {
  // Safely parse Django datetime (handles microseconds)
  parse: (datetime: DjangoDateTime): Date => {
    if (typeof datetime !== "string") {
      return new Date(NaN);
    }
    // Remove microseconds and convert to milliseconds precision
    const cleaned = datetime.replace(/(\.\d{3})\d+/, "$1");
    return new Date(cleaned);
  },

  // Convert to readable date (e.g., "May 27, 2025")
  toDateString: (
    datetime: DjangoDateTime,
    locale: string = "en-US"
  ): string => {
    return formatDjangoDateTime.parse(datetime).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Convert to time with seconds (e.g., "12:50:40 PM")
  toTimeString: (
    datetime: DjangoDateTime,
    locale: string = "en-US"
  ): string => {
    return formatDjangoDateTime.parse(datetime).toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  // Full datetime string (e.g., "May 27, 2025 at 12:50:40 PM")
  toFullString: (
    datetime: DjangoDateTime,
    locale: string = "en-US"
  ): string => {
    const date = formatDjangoDateTime.parse(datetime);
    return `${date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${date.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })}`;
  },

  // Get microseconds (441106 from your example)
  getMicroseconds: (datetime: DjangoDateTime): number => {
    const match = datetime.match(/\.(\d{6})/);
    return match ? parseInt(match[1], 10) : 0;
  },

  // ISO string without microseconds
  toCleanISOString: (datetime: DjangoDateTime): string => {
    return formatDjangoDateTime.parse(datetime).toISOString();
  },
};

// Strict validation for Django datetime format
export const isValidDjangoDateTime = (
  value: unknown
): value is DjangoDateTime => {
  if (typeof value !== "string") return false;

  // Test format: YYYY-MM-DDTHH:MM:SS.ssssssZ
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/;
  return (
    regex.test(value) && !isNaN(Date.parse(value.replace(/(\.\d{6})/, ".$1")))
  );
};
