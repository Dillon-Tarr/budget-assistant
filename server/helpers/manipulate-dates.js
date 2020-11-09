function setDateToMidday(milliseconds){
  let newDate = new Date(milliseconds);
  newDate.setHours(12, 0, 0, 0);
  return newDate;
}

function convertDaysOfWeekFromNameToNumber(daysOfWeek){
  const convertedDaysOfWeek = [];
  for (let i = 0; i < daysOfWeek.length; i++){
    switch(daysOfWeek[i]){
      case "Sunday":
        convertedDaysOfWeek.push(0); break;
      case "Monday":
        convertedDaysOfWeek.push(1); break;
      case "Tuesday":
        convertedDaysOfWeek.push(2); break;
      case "Wednesday":
        convertedDaysOfWeek.push(3); break;
      case "Thursday":
        convertedDaysOfWeek.push(4); break;
      case "Friday":
        convertedDaysOfWeek.push(5); break;
      case "Saturday":
        convertedDaysOfWeek.push(6); break;
      default:
        return undefined;
    }
  }
  return convertedDaysOfWeek;
}

function convertMonthFromNumberToName(monthNumber){
  switch(monthNumber){
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "ERROR";
  }
}

function getNumberOfDaysInMonth(date){
  const month = date.getMonth();
  switch(month){
    case 0:
      return 31;
    case 1:
      const year = date.getFullYear();
      const isLeapYear = checkIfLeapYear(year);
      if (isLeapYear) return 29;
      return 28;
    case 2:
      return 31;
    case 3:
      return 30;
    case 4:
      return 31;
    case 5:
      return 30;
    case 6:
      return 31;
    case 7:
      return 31;
    case 8:
      return 30;
    case 9:
      return 31;
    case 10:
      return 30;
    case 11:
      return 31;
  }
}

function checkIfLeapYear(year){
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

function setAcceptableDaysOfMonth(numberOfDaysInMonth, weekOfMonth){
  switch(weekOfMonth){
    case "first":
      return [1, 2, 3, 4, 5, 6, 7];
    case "second":
      return [8, 9, 10, 11, 12, 13, 14];
    case "third":
      return [15, 16, 17, 18, 19, 20, 21];
    case "fourth":
      return [22, 23, 24, 25, 26, 27, 28];
    case "last":
      switch(numberOfDaysInMonth){
        case 31:
          return [25, 26, 27, 28, 29, 30, 31];
        case 30:
          return [24, 25, 26, 27, 28, 29, 30];
        case 28:
          return [22, 23, 24, 25, 26, 27, 28];
        case 29:
          return [23, 24, 25, 26, 27, 28, 29];
        default:
          return `numberOfDaysInMonth must be 28, 29, 30, or 31.`;
      }
    default:
      return `INVALID weekOfMonth! Must be "N/A", "first", "second", "third", "fourth", or "last".`;
  }
}

module.exports = { setDateToMidday, convertDaysOfWeekFromNameToNumber, getNumberOfDaysInMonth, setAcceptableDaysOfMonth, convertMonthFromNumberToName }