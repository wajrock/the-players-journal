// Define a function `getMonthName` that returns the current month's name in French.
const getMonthName = (): string => {
  // An array of month names in French, starting with January.
  const months = [
    "Janvier",   // January
    "Février",   // February
    "Mars",      // March
    "Avril",     // April
    "Mai",       // May
    "Juin",      // June
    "Juillet",   // July
    "Août",      // August
    "Septembre", // September
    "Octobre",   // October
    "Novembre",  // November
    "Décembre",  // December
  ];

  // Create a new Date object for the current date and time.
  const date = new Date();
  
  // Get the current month of the year as a number (0 for January, 11 for December).
  // This line should use `date.getMonth()` instead of `date.getDay()` to retrieve the month.
  return months[date.getMonth()];
};

// Export the `getMonthName` function as the default export of the module.
export default getMonthName;
