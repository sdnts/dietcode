type Format = "short" | "long";

export const formatDate = (date: Date, format: Format = "short") => {
  if (format === "short") {
    const year = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      timeZone: "CET",
    }).format(date);
    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "CET",
    }).format(date);

    return `${month} ${year}`;
  }

  const year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "CET",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "CET",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: "CET",
  }).format(date);

  return `${day} ${month} ${year}`;
};
