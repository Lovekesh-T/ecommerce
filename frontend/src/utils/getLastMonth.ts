export const getLastMonths = (length: number): string[] => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();

  return Array.from({ length }, (_, i) => {
    return months.at(today.getMonth() - i)!;
  }).reverse();
};
