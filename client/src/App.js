import './App.css';
import { useSelector } from 'react-redux'
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Home from './components/Home';
import Title from './components/Title';


export default function App() {
  const page = useSelector(state => state.view.page);

  switch(page){
    case "Login":
      return (<>
        <Title/>
        <Login/>
      </>);
    case "CreateAccount":
      return (<>
        <Title/>
        <CreateAccount/>
      </>);
    case "Home":
      return <Home/>
    default:
      return (<>
        <Title/>
        <Login/>
      </>);
  }
}
