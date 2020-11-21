export function generateWelcomeMessage(displayName) {
  const now = new Date();
  const hours = now.getHours();
  const messages = []
  messages.push(`Hello, ${displayName}.`);
  messages.push(`Hi there, ${displayName}.`);

  switch(hours){
    case 0:
      messages.push(`Welcome to tomorrow.`);
      messages.push(`Welcome to tomorrow.`);
      break;
    case 1:
    case 2:
    case 3:
    case 4:
      messages.push(`Dark out, huh?`);
      break;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      messages.push(`Mornin', ${displayName}!`);
      messages.push(`Mornin', ${displayName}!`);
      messages.push(`Mornin', ${displayName}!`);
      messages.push(`Good morning, ${displayName}.`);
      messages.push(`Good morning, ${displayName}.`);
      messages.push(`Good morning, ${displayName}.`);
      break;
    case 10:
    case 11:
      messages.push(`Good day, ${displayName}.`);
      messages.push(`Good day, ${displayName}.`);
      messages.push(`Good day, ${displayName}.`);
      messages.push(`Good day, ${displayName}.`);
      messages.push(`Good day, ${displayName}.`);
      messages.push(`Good day, ${displayName}.`);
      break;
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
      messages.push(`Afternoon, ${displayName}.`);
      messages.push(`Afternoon, ${displayName}.`);
      messages.push(`Afternoon, ${displayName}.`);
      messages.push(`Afternoon, ${displayName}.`);
      messages.push(`Afternoon, ${displayName}.`);
      messages.push(`Afternoon, ${displayName}.`);
      break;
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
      messages.push(`Good evening, ${displayName}.`);
      messages.push(`Good evening, ${displayName}.`);
      messages.push(`Good evening, ${displayName}.`);
      messages.push(`Good evening, ${displayName}.`);
      messages.push(`Good evening, ${displayName}.`);
      messages.push(`Good evening, ${displayName}.`);
      break;
    default:
      break;
  }
  return messages[Math.floor(Math.random()*messages.length)];
}

export function getOrdinalSuffixAbbreviation(numberOrNumberString){
  let n;
  if (typeof numberOrNumberString === "string") n = parseInt(numberOrNumberString);
  else n = numberOrNumberString;
  const r = n % 10;
  const s = n % 100;
  if (r === 1 && s !== 11) {
    return "st";
  }
  else if (r === 2 && s !== 12) {
    return "nd";
  }
  else if (r === 3 && s !== 13) {
    return "rd";
  }
  return "th";
}

export function getOccurrenceString(incomeOrOutgoObject){
  let occurrenceString = `$${incomeOrOutgoObject.dollarsPerOccurrence} `;
  if (!incomeOrOutgoObject.isRecurring) {
    occurrenceString += "just once";
    return occurrenceString;
  }

  switch(incomeOrOutgoObject.weekOfMonthText){
    case "N/A":
      break;
    case "first":
    case "second":
    case "third":
    case "fourth":
    case "last":
      occurrenceString += `the ${incomeOrOutgoObject.weekOfMonthText} ${incomeOrOutgoObject.daysOfWeek[0]} of each month`
      return occurrenceString;
    default:
      break;
  }

  if (incomeOrOutgoObject.referencePeriod === "month"){
    occurrenceString += "on the ";
    if (incomeOrOutgoObject.daysOfMonth.length === 1) {
      const suffix = getOrdinalSuffixAbbreviation(incomeOrOutgoObject.daysOfMonth[0]);
      occurrenceString += `${incomeOrOutgoObject.daysOfMonth[0]}${suffix} `;
    }
    else if (incomeOrOutgoObject.daysOfMonth.length === 2) {
      let suffix0 = getOrdinalSuffixAbbreviation(incomeOrOutgoObject.daysOfMonth[0]);
      let suffix1 = getOrdinalSuffixAbbreviation(incomeOrOutgoObject.daysOfMonth[1]);
      occurrenceString += `${incomeOrOutgoObject.daysOfMonth[0]}${suffix0} and ${incomeOrOutgoObject.daysOfMonth[1]}${suffix1} `;
    }
    else {
      const lastDayIndex = incomeOrOutgoObject.daysOfMonth.length - 1;
      for (let i = 0; i < lastDayIndex; i++) {
        const suffix = getOrdinalSuffixAbbreviation(parseInt(incomeOrOutgoObject.daysOfMonth[i]));
        occurrenceString += `${incomeOrOutgoObject.daysOfMonth[i]}${suffix}, `;
      }
      const suffix = getOrdinalSuffixAbbreviation(incomeOrOutgoObject.daysOfMonth[lastDayIndex]);
      occurrenceString += `and ${incomeOrOutgoObject.daysOfMonth[lastDayIndex]}${suffix} `
    }
    occurrenceString += "of every ";
    if (incomeOrOutgoObject.multiplesOfPeriod === "1") void(0);
    else if (incomeOrOutgoObject.multiplesOfPeriod === "2") occurrenceString += "other ";
    else {
      const suffix = getOrdinalSuffixAbbreviation(parseInt(incomeOrOutgoObject.multiplesOfPeriod));
      occurrenceString += `${incomeOrOutgoObject.multiplesOfPeriod}${suffix} `;
    }
    occurrenceString += "month";
  }
  else {
    if (incomeOrOutgoObject.referencePeriod === "week"){
      occurrenceString += "on ";
      if (incomeOrOutgoObject.daysOfWeek.length === 1) occurrenceString += `${incomeOrOutgoObject.daysOfWeek[0]} `;
      else if (incomeOrOutgoObject.daysOfWeek.length === 2) occurrenceString += `${incomeOrOutgoObject.daysOfWeek[0]} and ${incomeOrOutgoObject.daysOfWeek[1]} `;
      else {
        const lastDayIndex = incomeOrOutgoObject.daysOfWeek.length - 1;
        for (let i = 0; i < lastDayIndex; i++) {
          occurrenceString += `${incomeOrOutgoObject.daysOfWeek[i]}, `;
        }
        occurrenceString += `and ${incomeOrOutgoObject.daysOfWeek[lastDayIndex]} `
      }
    }
    occurrenceString += "every ";
    if (incomeOrOutgoObject.multiplesOfPeriod === "1") occurrenceString += `${incomeOrOutgoObject.referencePeriod}`;
    else if (incomeOrOutgoObject.multiplesOfPeriod === "2") occurrenceString += `other ${incomeOrOutgoObject.referencePeriod}`;
    else occurrenceString += `${incomeOrOutgoObject.multiplesOfPeriod} ${incomeOrOutgoObject.referencePeriod}s`;
  }
  return occurrenceString;
}
