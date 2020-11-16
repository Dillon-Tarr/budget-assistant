import './App.css';
import { useSelector } from 'react-redux'
import Login from './components/pages/Login';
import CreateAccount from './components/pages/CreateAccount';
import Home from './components/pages/Home';

export default function App() {
  const page = useSelector(state => state.view.page);

  switch(page){
    case "Login":
      return <Login/>;
    case "CreateAccount":
      return <CreateAccount/>;
    case "Home":
      return <Home/>;
    default:
      return <Login/>;
  }
}
