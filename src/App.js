
import { ToastContainer } from 'react-toastify';
import './App.css';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import {Route, Routes, } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/' element={<Signup/>}></Route>
      <Route path='home' element={<HomePage/>}></Route>
      </Routes> 
      <ToastContainer/>
    </div>
  );
}

export default App;
