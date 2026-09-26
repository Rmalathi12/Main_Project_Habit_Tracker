// returns the current date formatted as 'YYYY-MM-DD'
const getTodayDateString = () => {
  const d = new Date(); //get current date and time
  const year = d.getFullYear(); //extract 4-digit year (eg 2020)
  const month = String(d.getMonth() + 1).padStart(2, "0"); //get month (0-11,so add 1) and pad with '0' if single digit
  const day = String(d.getDate()).padStart(2, "0"); // get day of month and pad with '0' if single digit
  return `${year}-${month}-${day}`; //combine into 'YYYY-MM-DD'
};

// Checks if a given 'YYYY-MM-DD' date string falls on a weekday (Monday to Friday)
const isWeekday = (dateStr) => {
  const date = new Date(dateStr); //convert the date string into a date object
  const day = date.getDay(); //get day of the week as a number (0 to 6)
  return day >= 1 && day <= 5; //returns true if monday(1) through friday (5)
};

module.exports = {
  getTodayDateString,
  isWeekday,
};
