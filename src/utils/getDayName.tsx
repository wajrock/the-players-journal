// Define a function `getDayName` that returns the current day's name in French.
const getDayName = (): string => {
  // An array of day names in French, starting with Sunday.
  const days = [
    "Dimanche",   // Sunday
    "Lundi",      // Monday
    "Mardi",      // Tuesday
    "Mercredi",   // Wednesday
    "Jeudi",      // Thursday
    "Vendredi",   // Friday
    "Samedi",     // Saturday
  ];
  
  // Create a new Date object for the current date and time.
  const date = new Date();
  
  // Get the current day of the week as a number (0 for Sunday, 6 for Saturday),
  // and use it to index into the `days` array to get the corresponding day name in French.
  return days[date.getDay()];
};

// Export the `getDayName` function as the default export of the module.
export default getDayName;
