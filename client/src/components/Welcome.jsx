export default function Welcome(props) {
  const now = new Date();
  const hours = now.getHours();
  const messages = []
  messages.push(`Hello, ${props.displayName}.`);
  messages.push(`Hi there, ${props.displayName}.`);

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
      messages.push(`Dark out, huh?`);
      break;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      messages.push(`Mornin', ${props.displayName}!`);
      messages.push(`Mornin', ${props.displayName}!`);
      messages.push(`Mornin', ${props.displayName}!`);
      messages.push(`Good morning, ${props.displayName}.`);
      messages.push(`Good morning, ${props.displayName}.`);
      messages.push(`Good morning, ${props.displayName}.`);
      break;
    case 10:
    case 11:
      messages.push(`Good day, ${props.displayName}.`);
      messages.push(`Good day, ${props.displayName}.`);
      messages.push(`Good day, ${props.displayName}.`);
      messages.push(`Good day, ${props.displayName}.`);
      messages.push(`Good day, ${props.displayName}.`);
      messages.push(`Good day, ${props.displayName}.`);
      break;
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
      messages.push(`Afternoon, ${props.displayName}.`);
      messages.push(`Afternoon, ${props.displayName}.`);
      messages.push(`Afternoon, ${props.displayName}.`);
      messages.push(`Afternoon, ${props.displayName}.`);
      messages.push(`Afternoon, ${props.displayName}.`);
      messages.push(`Afternoon, ${props.displayName}.`);
      break;
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
      messages.push(`Good evening, ${props.displayName}.`);
      messages.push(`Good evening, ${props.displayName}.`);
      messages.push(`Good evening, ${props.displayName}.`);
      messages.push(`Good evening, ${props.displayName}.`);
      messages.push(`Good evening, ${props.displayName}.`);
      messages.push(`Good evening, ${props.displayName}.`);
      break;
    default:
      break;
  }

  const message = messages[Math.floor(Math.random()*messages.length)]
  
  return (
    <p id="welcome">{message}</p>
  )
}
