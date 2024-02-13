export const formatDate = (date: Date) => {
	const year = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		timeZone: "CET",
	}).format(date);
	const month = new Intl.DateTimeFormat("en-US", {
		month: "2-digit",
		timeZone: "CET",
	}).format(date);
	const day = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		timeZone: "CET",
	}).format(date);

	return `${year}-${month}-${day}`;
};
