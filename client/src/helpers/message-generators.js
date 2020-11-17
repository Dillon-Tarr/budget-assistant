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
