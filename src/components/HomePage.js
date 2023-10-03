import React from "react";
import "./homepage.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatBox from "./ChatBox";
import { useSelector } from "react-redux";
import { chatActions } from "../store/chat-redux";
import { onUserLogout } from "../store/user-action";


const HomePage = () => {
   const isLoggedIn = useSelector((state) => state.user.LoggedInUser);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    const token = localStorage.getItem('token')
    dispatch(onUserLogout(token))
    dispatch(chatActions.cleargrouplist())
    dispatch(chatActions.clearGroup())
    localStorage.removeItem("token");
    navigate("/");
  };

 if(!isLoggedIn){
  return <div style={{
    color: '#333',
    padding: '16px',
    borderRadius: '4px',
    maxWidth: '300px',
    margin: '20px auto',
    textAlign: 'center',
  }}>
    <p>Oops!!! Something Went Wrong. Login Again</p>
  </div>
 }
 

  return (
    <div className="chat-body">
      <div className="title">
        <h2 style={{ fontFamily: "cursive" }}>ChatMozella</h2>
        <button onClick={logoutHandler}>Logout</button>
      </div>
      <div className="content">
        <Sidebar />
        <div className="chat-container">
          <ChatBox />
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
