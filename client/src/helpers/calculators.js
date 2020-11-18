import { setDateToMidday } from './manipulate-dates';

export function calculateYearlyIncomeOrOutgo(incomeOrOutgo){
  const today = setDateToMidday(Date.now());
  const oneYearFromNow = new Date(today.getTime() + 31536000000);
  let sum = 0;
  for (let i = 0; i < incomeOrOutgo.length; i++) {
    const nextOccurrenceIndex = incomeOrOutgo[i].occurrences.findIndex(date => {
      date = new Date(date);
      return date.getTime() >= today.getTime();
    });
    if (nextOccurrenceIndex === -1) continue;
    for (let o = nextOccurrenceIndex; o < incomeOrOutgo[i].occurrences.length; o++) {
      const date = new Date(incomeOrOutgo[i].occurrences[o]);
      if (date.getTime() >= oneYearFromNow.getTime()) break;
      sum += incomeOrOutgo[i].dollarsPerOccurrence;
    }
  }
  return sum;
}
