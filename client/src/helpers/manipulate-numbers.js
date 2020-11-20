function getOrdinalSuffixAbbreviation(numberString){
  switch(numberString){
    case "1":
    case "21":
    case "31":
      return "st";
    case "2":
    case "22":
      return "nd";
    case "3":
    case "23":
      return "rd";
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "10":
    case "11":
    case "12":
    case "13":
    case "14":
    case "15":
    case "16":
    case "17":
    case "18":
    case "19":
    case "20":
    case "24":
    case "25":
    case "26":
    case "27":
    case "28":
    case "29":
    case "30":
      return "th";
    default:
      return "I haven't accounted for that number yet."
  }
}

function convertFromDayXToNumbers(dayXArray){ //converts something like ["day1", "day15"] to [1, 15]
  const daysOfMonth = [];
  for (let i = 0; i < dayXArray.length; i++){
    daysOfMonth.push(parseInt(dayXArray[i].slice(3)));
  }
  return daysOfMonth;
}

module.exports = { getOrdinalSuffixAbbreviation, convertFromDayXToNumbers }