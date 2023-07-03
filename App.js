
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Pages/Login';
import SeatAllotment from './Pages/SeatAllotment';
import MyAllotment from './Pages/MyAllotment';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route  path='/' element = {<Login/>}/>
        <Route path='/seatallotment' element = {<SeatAllotment/>}/>
        <Route path='/myallotment' element = {<MyAllotment/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
