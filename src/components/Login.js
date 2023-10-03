import React, {  useRef } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import './login.css'
import {useDispatch} from 'react-redux'
import { addUsers } from '../store/user-action';
import chatImage from '../assets/contact.png'




const Login = () => {

  
  
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const obj = {
      email,
      password
    };
    const response = await dispatch(addUsers(obj));

    if (!response.error) {
      
      navigate('/home');
    } else {
      
      console.error('Signup failed:', response.error);
    }
   
  };

  return (
    <div className="login-container">
       <div className='chatImage'><img src={chatImage} alt='chatapp'/></div>
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" ref={emailRef} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary">Login</button>
        </form>
        <Link to='/' className='linkline'>New  User ? Signup?</Link>
        <Link to='/resetpassword' className='linkline'>Reset Password</Link>
      </div>
    </div>
  );
}

export default Login;