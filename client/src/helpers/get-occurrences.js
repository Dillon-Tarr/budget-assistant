const { setDateToMidday, convertDaysOfWeek, getNumberOfDaysInMonth, setAcceptableDaysOfMonth, checkIfLeapYear } = require('./manipulate-dates');

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
            while (day.getTime() <= inclusiveEndDate.getTime()){
              if (daysOfWeek.includes(dayOfWeekOfDay)) occurrences.push(day);
              day = new Date(day.getTime() + 86400000);
              dayOfWeekOfDay = day.getDay();
            }
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

function getOutgoBreakdownData(outgo, referencePeriod, multiplesOfPeriod, includeOneTimeExpenses, includeInfrequentExpenses){
  multiplesOfPeriod = parseInt(multiplesOfPeriod);
  const timeframe = getTimeframe(referencePeriod, multiplesOfPeriod);
  const today = setDateToMidday(Date.now());
  const checkUntilThisManyMilliseconds = setDateToMidday(Date.now() + timeframe).getTime();
  includeInfrequentExpenses = includeInfrequentExpenses === "true"; // can be included while one time expenses are not included
  includeOneTimeExpenses = includeOneTimeExpenses === "true" && includeInfrequentExpenses; // can only be included if infrequent expenses are included
  const data = [];
  if (!includeInfrequentExpenses){
    outgo = outgo.filter(outgoObject => {
      if (outgoObject.occurrences.length < 2) return false;
      const timeBetweenOccurrences = getTimeBetweenOccurrences(outgoObject.occurrences[0], outgoObject.occurrences[1]);
      return timeBetweenOccurrences <= timeframe;
    });
  }
  else if (includeInfrequentExpenses && !includeOneTimeExpenses) {
    outgo = outgo.filter(outgoObject => {
      return outgoObject.occurrences.length >= 2;
    });
  }
  for (let i = 0; i < outgo.length; i++){
    let numberOfOccurrencesInTimeframe = 0;
    const nextOccurrenceIndex = outgo[i].occurrences.findIndex(date => new Date(date).getTime() >= today.getTime());
    for (let o = nextOccurrenceIndex; o < outgo[i].occurrences.length - nextOccurrenceIndex; o++){
      if (setDateToMidday(outgo[i].occurrences[o]).getTime() > checkUntilThisManyMilliseconds) break;
      else numberOfOccurrencesInTimeframe++;
    }
    const entryIndex = data.findIndex(entry => entry[0] === outgo[i].category);
    if (entryIndex === -1) data.push([outgo[i].category, numberOfOccurrencesInTimeframe*outgo[i].dollarsPerOccurrence]);
    else data[entryIndex][1] += numberOfOccurrencesInTimeframe*outgo[i].dollarsPerOccurrence;
  }

  return data;
}

function getTimeframe(referencePeriod, multiplesOfPeriod){
  switch(referencePeriod){
    case "month":
      return 31*multiplesOfPeriod*86400000;
    case "week":
      return 7*multiplesOfPeriod*86400000;
    case "year":
      return 365*multiplesOfPeriod*86400000;
    default:
      return 31*multiplesOfPeriod*86400000;
  }
}

function getTimeBetweenOccurrences(occurrence1, occurrence2){
  return Math.abs(new Date(occurrence2).getTime() - new Date(occurrence1).getTime());
}

function getOrderedIncomeAndOutgo(income, outgo){
  let orderedIncomeAndOutgo = [];
  for (let i = 0; i < income.length; i++) {
    for (let j = 0; j < income[i].occurrences.length; j++){
      orderedIncomeAndOutgo.push({
        name: income[i].name,
        type: "income",
        amount: income[i].dollarsPerOccurrence,
        ms: setDateToMidday(income[i].occurrences[j]).getTime()
      });
    }
  }
  for (let i = 0; i < outgo.length; i++) {
    for (let j = 0; j < outgo[i].occurrences.length; j++){
      orderedIncomeAndOutgo.push({
        name: outgo[i].name,
        type: "outgo",
        category: outgo[i].category,
        amount: outgo[i].dollarsPerOccurrence,
        ms: setDateToMidday(outgo[i].occurrences[j]).getTime()
      });
    }
  }
  orderedIncomeAndOutgo.sort((a, b) => a.ms - b.ms);
  return orderedIncomeAndOutgo;
}

function getDataBetweenDates(orderedIncomeAndOutgo, startDate, endDate){
  const startIndex = orderedIncomeAndOutgo.findIndex(el => el.ms >= setDateToMidday(startDate).getTime());
  orderedIncomeAndOutgo.splice(0, startIndex);
  const oneAfterEndIndex = orderedIncomeAndOutgo.findIndex(el => el.ms > setDateToMidday(endDate).getTime());
  orderedIncomeAndOutgo.splice(oneAfterEndIndex);
  let netIncrease = 0;
  orderedIncomeAndOutgo.forEach(occurrence => {
    occurrence.type === "income" ? netIncrease += occurrence.amount : netIncrease -= occurrence.amount;
  });
  const dataBetweenDates = {
    incomeAndOutgo: orderedIncomeAndOutgo,
    netIncrease: netIncrease
  };
  return dataBetweenDates;
}


module.exports = { getAllOccurrences, getOutgoBreakdownData, getOrderedIncomeAndOutgo, getDataBetweenDates };