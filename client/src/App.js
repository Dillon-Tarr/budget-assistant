import './App.css';
import { useSelector } from 'react-redux'
import Login from './components/pages/Login';
import CreateAccount from './components/pages/CreateAccount';
import Main from './components/Main';

export default function App() {
  const page = useSelector(state => state.view.page);

  switch(page){
    case "Login":
      return <Login/>;
    case "CreateAccount":
      return <CreateAccount/>;
    case "Home":
      return <Main/>;
    default:
      return <Login/>;
  }
}
