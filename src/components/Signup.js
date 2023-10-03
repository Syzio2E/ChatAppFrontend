  import React, { useRef } from 'react';
  import { Link,useNavigate } from 'react-router-dom';
  import './signup.css'
  import { useDispatch } from 'react-redux';
  import {  newUser } from '../store/user-action';
  import { ToastContainer } from 'react-toastify';
  import chatImage from '../assets/contact.png'



  const Signup = () => {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const submitHandler = async (e) => {
      e.preventDefault();
      const name = usernameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
    

      const obj = {
        name,
        email,
        password
      };
        const response = await dispatch(newUser(obj));
        if (!response.error) {
         
          navigate('/home');
        } else {
          console.error('Signup failed:', response.error);
        }
      
  }

    return (
      <div className="signup-container">
        <div className='chatImage'><img src={chatImage} alt='chatapp'/></div>
        <div className="signup-box">
          <h2 className="signup-title">Sign Up</h2>
          <form className="signup-form" onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                ref={usernameRef}
                required
              />
            </div>
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
            <button type="submit" className="btn btn-secondary">Signup</button>
          </form>
          <Link to='/Login' className='linkline'>Already a User ? Login?</Link>
          <Link to='/resetpassword' className='linkline'>Reset Password</Link>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  export default Signup;