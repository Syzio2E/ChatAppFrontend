import React, { useEffect, useState, useRef } from "react";
import classes from "./ChatBox.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  UserGroupMessages,
  fetchUserGroups,
  getGroupMessages,
  getSelectedUserMessage,
  userSingleChat,
} from "../store/chat-actions";
import { chatActions } from "../store/chat-redux";
import SettingModal from "./SettingModal";
import { userActions } from "../store/user-redux";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
export var socket = io(ENDPOINT);

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const sendingToUserName = useSelector((state) => state.user.chattingwith);
  const senderId = useSelector((state) => state.user.senderid);
  const groupselected = useSelector((state) => state.chat.group);
  const token = useSelector((state) => state.user.token);
  const usermessages = useSelector((state) => state.chat.messages);
  const [modal, setModal] = useState(false);
  const groupId = useSelector((state) => state.chat.groupid);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.LoggedInUser);
  // const [socketconnected,setSocketConnected] = useState(false)
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user && (senderId || groupId)) {
      socket = io(ENDPOINT);

      if (senderId) {
        socket.emit("setup", senderId);
        socket.on("message received", (newMessageReceived) => {
          const receiverId = newMessageReceived.receiverId;
          const talkingwith = newMessageReceived.userId;
          if (
            !groupselected &&
            senderId &&
            user === +receiverId &&
            senderId === +talkingwith
          ) {
            dispatch(chatActions.addMessage(newMessageReceived));
          }
        });
      } else if (groupId) {
        socket.emit("setup", groupId);
        socket.on("message received", (newMessageReceived) => {
          if (groupselected && groupId === +newMessageReceived.groupchatId) {
            dispatch(chatActions.addMessage(newMessageReceived));
          }
        });
      }
      socket.on("connection", () => {
        // Handle socket connection events if needed
      });
    }

    return () => {
      if (socket && (senderId || groupId)) {
        socket.disconnect();
      }
    };
  }, [user, username, senderId, groupId, groupselected, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (groupId && token) {
      socket.emit("join chat", groupId);
      dispatch(getGroupMessages(groupId, token));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    const getUserGroups = (token) => {
      dispatch(chatActions.cleargrouplist());
      dispatch(fetchUserGroups(token));
    };
    if (token) {
      getUserGroups(token);
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [usermessages]);

  useEffect(() => {
    const clearAndFetchMessages = async (senderId, token) => {
      dispatch(chatActions.clearMessages());
      dispatch(getSelectedUserMessage(senderId, token));
    };

    const clearandFetchGroupMessages = async (groupId, token) => {
      dispatch(chatActions.clearMessages());
      dispatch(getGroupMessages(groupId, token));
    };

    if (senderId && token) {
      clearAndFetchMessages(senderId, token);
      socket.emit("join chat", senderId);
    }
    if (groupId && token) {
      clearandFetchGroupMessages(groupId, token);
      socket.emit("join chat", groupId);
    }
  }, [token, dispatch, senderId, groupId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const obj = { message: message };
    if (!obj || !obj.message || obj.message.trim().length === 0) {
      return;
    }
    let chatMessage;

    if (groupselected && groupId && token) {
      // Group chat logic
      chatMessage = await dispatch(UserGroupMessages(groupId, token, obj));
      if (socket && chatMessage) {
        socket.emit("new message", chatMessage);
      }
    } else if (senderId && token) {
      // Single chat logic
      chatMessage = await dispatch(userSingleChat(senderId, token, obj));
      console.log(chatMessage);
      if (socket && chatMessage) {
        socket.emit("new message", chatMessage);
      }
    }
    setMessage("");
  };

  const settingModalhandler = () => {
    setModal(true);
  };

  const closemodalHandler = () => {
    setModal(false);
  };

  const clearmessageHandler = () => {
    dispatch(userActions.clearChattingWithUser());
    dispatch(chatActions.clearGroup());
  };

  return (
    <div>
      <section className={classes.msger}>
        <header className={classes.msger_header}>
          <div className={classes.msger_header_title}>
            <i className="fas fa-comment-alt"></i>{" "}
            {sendingToUserName || groupselected}
          </div>
          <div className={classes.msger_header_options}>
            {(groupselected || sendingToUserName) && (
              <span
                className={classes.close_button}
                onClick={clearmessageHandler}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
            )}
            {groupselected && (
              <span>
                <i
                  className="fas fa-cog"
                  style={{ cursor: "pointer" }}
                  onClick={settingModalhandler}
                ></i>
              </span>
            )}
          </div>
        </header>
        {modal && groupselected && (
          <SettingModal closemodalHandler={closemodalHandler} />
        )}
        <main className={classes.msger_chat} ref={chatContainerRef}>
          {sendingToUserName && (
            <>
              {usermessages.map((message, index) => (
                <div
                  className={`${classes.msg} ${
                    message.userId === senderId
                      ? classes["left_msg"]
                      : classes["right_msg"]
                  }`}
                  key={index}
                >
                  {/* Add sender's name, if necessary */}
                  {message.userId !== senderId && (
                    <div className={classes.msg_info}>
                      {/* <div className={classes.msg_info_name}>{message.senderName}</div> */}
                    </div>
                  )}
                  <div className={classes.msg_bubble}>
                    <div className={classes.msg_text}>
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {groupId && (
            <>
              {usermessages.map((message, index) => (
                <div
                  className={`${classes.msg} ${
                    message.sender === user
                      ? classes["right_msg"]
                      : classes["left_msg"]
                  }`}
                  key={index}
                >
                  {/* Add sender's name, if necessary */}
                  {message.userId !== senderId && (
                    <div className={classes.msg_info}>
                      {/* <div className={classes.msg_info_name}>{message.senderId}</div> */}
                    </div>
                  )}
                  <div className={classes.msg_bubble}>
                    <div className={classes.msg_text}>
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </main>

        <form className={classes.msger_inputarea} onSubmit={submitHandler}>
          <input
            type="text"
            id="message"
            className={classes.msger_input}
            placeholder="Enter your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button type="submit" className={classes.msger_send_btn}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChatBox;
