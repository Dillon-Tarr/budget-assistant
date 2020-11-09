const { setDateToMidday, convertDaysOfWeekFromNameToNumber, getNumberOfDaysInMonth, setAcceptableDaysOfMonth, convertMonthFromNumberToName } = require('./manipulate-dates');
const { getOrdinalAbbreviationSuffix } = require('./manipulate-numbers');

function getAllOccurrences(outgoObject){
  const occurrences = [];
  const startDate = setDateToMidday(outgoObject.startDate.getTime());
  if (outgoObject.isRecurring === false) occurrences.push(startDate); //type: single-occurrence
  // else: recurring types
  const inclusiveEndDate = setDateToMidday(outgoObject.inclusiveEndDate);
  const dateToCheckAfter = new Date(startDate.getTime() - 86400000);
  
  if (outgoObject.weekOfMonthText !== "N/A" && outgoObject.daysOfWeek !== "N/A" && outgoObject.daysOfWeek.length === 1){ //type: occurring once per month on a certain day of week and week of month
    const weekOfMonth = outgoObject.weekOfMonthText;
    const daysOfWeek = convertDaysOfWeekFromNameToNumber(outgoObject.daysOfWeek);
    if (!daysOfWeek) return occurrences;
    const dayOfWeek = daysOfWeek[0];
  
    let day = new Date(dateToCheckAfter.getTime() + 86400000);
    console.log('We got this far.');
    let month = day.getMonth();
    let numberOfDaysInMonth = getNumberOfDaysInMonth(day);
    let acceptableDaysOfMonth = setAcceptableDaysOfMonth(numberOfDaysInMonth, weekOfMonth);
    while (day <= inclusiveEndDate){
      const newMonth = new Date(day.getMonth());
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
    if (outgoObject.referencePeriod === "N/A" || outgoObject.multiplesOfPeriod === "N/A") return occurrences;
    const multiplesOfPeriod = parseInt(outgoObject.multiplesOfPeriod);
    if (multiplesOfPeriod < 1) return occurrences;
    const referencePeriod = outgoObject.referencePeriod;
    const daysOfWeek = outgoObject.daysOfWeek;
    const daysOfMonth = outgoObject.daysOfMonth;
    if (!daysOfWeek.includes("N/A")){
      daysOfWeek = convertDaysOfWeekFromNameToNumber(daysOfWeek);
      if (!daysOfWeek) return occurrences;
    }
    let day = new Date(dateToCheckAfter.getTime() + 86400000);
    switch(referencePeriod){
      case "month":
        let dayOfMonthOfDay = day.getDate();
        while (day <= inclusiveEndDate){
          if (daysOfMonth.includes(dayOfMonthOfDay)) occurrences.push(day);
          day = new Date(day.getTime() + 86400000);
          dayOfMonthOfDay = day.getDate();
          if (multiplesOfPeriod > 1 && dayOfMonthOfDay === 1){
            for (let i = 1; i < multiplesOfPeriod; i++){
              let numberOfDaysInMonth = getNumberOfDaysInMonth(day);
              day = new Date(day.getTime() + (numberOfDaysInMonth * 86400000));
            }
            dayOfMonthOfDay = day.getDate();
          }
        }
        return occurrences;
      case "week":
        let dayOfWeekOfDay = day.getDay();
        while (day <= inclusiveEndDate){
          for (let i = 1; i <= 7; i++){
            while (day <= inclusiveEndDate){
              if (daysOfWeek.includes(dayOfWeekOfDay)) occurrences.push(day);
              day = new Date(day.getTime() + 86400000);
              dayOfWeekOfDay = day.getDay();
            }
          }
          if (multiplesOfPeriod > 1) {
            day = new Date(day.getTime() + ((multiplesOfPeriod - 1) * 7 * 86400000));
            dayOfWeekOfDay = day.getDay();
          }
        }
        return occurrences;
      case "day":
        return occurrences;
      case "year":
        return occurrences;
      default:
        return occurrences;
    }
  }
}

function getReminders(budget){
  const reminders = [];
  const today = setDateToMidday(Date.now);
  for (let i = 0; i < budget.outgo.length; i++){
    const dayToUnmuteReminders = setDateToMidday(budget.outgo[i].muteRemindersUntil);
    if (budget.outgo[i].doRemind === false || dayToUnmuteReminders.getTime() > today.getTime()) continue;
    const remindThisManyDaysBefore = parseInt(budget.outgo[i].remindThisManyDaysBefore);
    const occurrences = getAllOccurrences(budget.outgo[i]);
    const nextOccurrence = occurrences.find((date) => date.getTime() >= today.getTime());
    if ((nextOccurrence.getTime() - today.getTime()) / 86400000 > remindThisManyDaysBefore) continue;
    const dollarsPerOccurrence = budget.outgo[i].dollarsPerOccurrence.toString();
    const month = convertMonthFromNumberToName(nextOccurrence.getMonth());
    const day = nextOccurrence.getDate().toString();
    const suffix = getOrdinalAbbreviationSuffix(day);
    const year = nextOccurrence.getFullYear();
    reminders.push(`${budget.outgo[i].name} | $${dollarsPerOccurrence} on ${month} ${day}${suffix}, ${year}`);
  }
  return reminders;
}

module.exports = { getAllOccurrences, getReminders };