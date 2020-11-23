const { setDateToMidday, convertDaysOfWeek, getNumberOfDaysInMonth, setAcceptableDaysOfMonth, convertMonthFromNumberToName, checkIfLeapYear } = require('./manipulate-dates');
const { getOrdinalSuffixAbbreviation } = require('./manipulate-numbers');

function getAllOccurrences(incomeOrOutgoObject){
  const occurrences = [];
  let day = setDateToMidday(incomeOrOutgoObject.startDate.getTime());
  if (incomeOrOutgoObject.isRecurring === false){ //type: single-occurrence
    occurrences.push(day);
    return occurrences;
  }
  const inclusiveEndDate = setDateToMidday(incomeOrOutgoObject.inclusiveEndDate);
  if (incomeOrOutgoObject.weekOfMonthText !== "N/A" && incomeOrOutgoObject.daysOfWeek !== "N/A" && incomeOrOutgoObject.daysOfWeek.length === 1){ //type: occurring once per month on a certain day of week and week of month
    const weekOfMonth = incomeOrOutgoObject.weekOfMonthText;
    const daysOfWeek = convertDaysOfWeek(incomeOrOutgoObject.daysOfWeek);
    if (!daysOfWeek) return [`!!!ERROR!!! if (incomeOrOutgoObject.weekOfMonthText !== "N/A" && incomeOrOutgoObject.daysOfWeek !== "N/A" && incomeOrOutgoObject.daysOfWeek.length === 1) { daysOfWeek must include exactly one day of the week. } Example: ["Wednesday"]`];
    const dayOfWeek = daysOfWeek[0];
  
    let month = day.getMonth();
    let numberOfDaysInMonth = getNumberOfDaysInMonth(day);
    let acceptableDaysOfMonth = setAcceptableDaysOfMonth(numberOfDaysInMonth, weekOfMonth);
    while (day.getTime() <= inclusiveEndDate.getTime()){
      const newMonth = day.getMonth();
      if (newMonth !== month){
        month = newMonth;
        numberOfDaysInMonth = getNumberOfDaysInMonth(day);
        acceptableDaysOfMonth = setAcceptableDaysOfMonth(numberOfDaysInMonth, weekOfMonth);
      }
      const dayOfWeekOfDay = day.getDay();
      const dayOfMonthOfDay = day.getDate();
      if (dayOfWeekOfDay === dayOfWeek && acceptableDaysOfMonth.includes(dayOfMonthOfDay)) occurrences.push(day);
      day = new Date(day.getTime() + 86400000);
    }
    return occurrences;
  }
  else{ // all other recurring types
    if (incomeOrOutgoObject.referencePeriod === "N/A" || incomeOrOutgoObject.multiplesOfPeriod === "N/A") return [`!!!ERROR!!! If something is recurring, it must have a reference period (i.e. "month", "week", "day", or "year") and the multiples of that period ("1" for "every", "2" for "every other", etc.).`];
    const multiplesOfPeriod = parseInt(incomeOrOutgoObject.multiplesOfPeriod);
    if (multiplesOfPeriod < 1) return [`!!!ERROR!!! multiplesOfPeriod must be a string representing an integer greater than or equal to 1.`];
    const referencePeriod = incomeOrOutgoObject.referencePeriod;
    switch(referencePeriod){
      case "month":
        const daysOfMonth = incomeOrOutgoObject.daysOfMonth;
        let dayOfMonthOfDay = day.getDate();
        while (day.getTime() <= inclusiveEndDate.getTime()){
          if (daysOfMonth.includes(dayOfMonthOfDay)) occurrences.push(day);
          day = new Date(day.getTime() + 86400000);
          dayOfMonthOfDay = day.getDate();
          if (dayOfMonthOfDay === 1 && multiplesOfPeriod > 1){
            for (let i = 1; i < multiplesOfPeriod; i++){
              let numberOfDaysInMonth = getNumberOfDaysInMonth(day);
              day = new Date(day.getTime() + numberOfDaysInMonth*86400000);
            }
            dayOfMonthOfDay = day.getDate();
          }
        }
        break;
      case "week":
        const daysOfWeek = convertDaysOfWeek(incomeOrOutgoObject.daysOfWeek);
        if (!daysOfWeek) return [`!!!ERROR!!! The only values allowed in daysOfWeek (besides "N/A") are "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", and "Saturday".`];
        let dayOfWeekOfDay = day.getDay();
        while (day.getTime() <= inclusiveEndDate.getTime()){
          for (let i = 1; i <= 7; i++){
            if (day.getTime() > inclusiveEndDate.getTime()) break;
            if (daysOfWeek.includes(dayOfWeekOfDay)) occurrences.push(day);
            day = new Date(day.getTime() + 86400000);
            dayOfWeekOfDay = day.getDay();
          }
          if (multiplesOfPeriod > 1) {
            day = new Date(day.getTime() + ((multiplesOfPeriod - 1)*7*86400000));
            dayOfWeekOfDay = day.getDay();
          }
        }
        break;
      case "day":
        while (day.getTime() <= inclusiveEndDate.getTime()){
          occurrences.push(day);
          day = new Date(day.getTime() + (multiplesOfPeriod*86400000));
        }
        break;
      case "year":
        if (day.getMonth() >= 2 || (day.getDate() === 29 && day.getMonth() === 1)){
          while (day.getTime() <= inclusiveEndDate.getTime()){
            occurrences.push(day);
            for (let i = 1; i <= multiplesOfPeriod; i++){
              let extraDay = 0;
              const nextYearIsLeapYear = checkIfLeapYear(day.getFullYear() + 1);
              if (nextYearIsLeapYear) extraDay = 1;
              day = new Date(day.getTime() + (365 + extraDay)*86400000);
            }
          }
          break;
        }
        else {
          while (day.getTime() <= inclusiveEndDate.getTime()){
            occurrences.push(day);
            for (let i = 1; i <= multiplesOfPeriod; i++){
              let extraDay = 0;
              const thisYearIsLeapYear = checkIfLeapYear(day.getFullYear());
              if (thisYearIsLeapYear) extraDay = 1;
              day = new Date(day.getTime() + (365 + extraDay)*86400000);
            }
          }
          break;
        }
      default:
        break;
    }
    return occurrences;
  }
}

function getReminders(budget){
  const reminders = [];
  const today = setDateToMidday(Date.now());
  for (let i = 0; i < budget.outgo.length; i++){
    const dayToUnmuteReminders = setDateToMidday(budget.outgo[i].muteRemindersUntil);
    if (budget.outgo[i].doRemind === false || dayToUnmuteReminders.getTime() > today.getTime()) continue;
    const remindThisManyDaysBefore = parseInt(budget.outgo[i].remindThisManyDaysBefore);
    const occurrences = getAllOccurrences(budget.outgo[i]);
    const nextOccurrence = occurrences.find(date => date.getTime() >= today.getTime());
    if (!nextOccurrence || ((nextOccurrence.getTime() - today.getTime()) / 86400000 > remindThisManyDaysBefore)) continue;
    const dollarsPerOccurrence = budget.outgo[i].dollarsPerOccurrence.toString();
    const month = convertMonthFromNumberToName(nextOccurrence.getMonth());
    const day = nextOccurrence.getDate().toString();
    const suffix = getOrdinalSuffixAbbreviation(day);
    const year = nextOccurrence.getFullYear();
    reminders.push({
      budgetId: budget._id,
      outgoId: budget.outgo[i]._id,
      nextOccurrence: nextOccurrence,
      text: `${budget.outgo[i].name} | $${dollarsPerOccurrence} on ${month} ${day}${suffix}, ${year}`
    });
    console.log(reminders);
  }
  return reminders;
}

module.exports = { getAllOccurrences, getReminders };