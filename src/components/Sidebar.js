import React, { useEffect, useState } from "react";
import classes from "./sidebar.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { userActions } from "../store/user-redux";
import { chatActions } from "../store/chat-redux";
import { toast } from "react-toastify";
import { useRef } from "react";

const Sidebar = () => {
  const username = useSelector((state) => state.user.LoggedInUser);
  const senderTo = useSelector((state) => state.user.chattingwith);
  const [onlineusers, setOnlineUsers] = useState([]);
  const [modalopen, setOpenModal] = useState(false);
  const [usertalkedto, setUserTalkedTo] = useState([]);
  const dispatch = useDispatch();
  const [searchUser, setSearchUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [showdropdown, setShowDropDown] = useState(false);
  const groups = useSelector((state) => state.chat.grouplist);
  const messageList = useSelector((state) => state.chat.messages);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (username) {
      const getOnlineUsers = () => {
        const token = localStorage.getItem("token");
        axios
          .get("http://3.109.133.91:8000/users", {
            headers: { Authorization: token },
          })
          .then((response) => {
            setOnlineUsers(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      };
      getOnlineUsers();
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      const gettalkedtoUsers = () => {
        const token = localStorage.getItem("token");
        axios
          .get("http://3.109.133.91:8000/userchat", {
            headers: { Authorization: token },
          })
          .then((response) => {
            setUserTalkedTo(response.data.users);
          })
          .catch((error) => {
            console.error(error);
          });
      };
      gettalkedtoUsers();
    }
  }, [senderTo, username, messageList]);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropDown(false);
        setUserList([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const modalHandler = () => {
    setOpenModal(true);
  };

  const closemodalHandler = () => {
    setOpenModal(false);
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (searchUser) {
      const response = await axios.get(
        `http://3.109.133.91:8000/home?search=${searchUser}`,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        console.log(response.data.users);
        if (response.data.users.length === 0) {
          toast.warning("No User Found", {
            position: "bottom-center",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        if (response.data.users.length > 0) {
          setUserList(response.data.users);
          setShowDropDown(true);
        }
      }
    }
  };

  return (
    <div className={classes.sidebar_wrapper}>
      <div className={classes.sidebar}>
        <p>Hi {username}</p>
        <div className={classes.search_box}>
          <input
            type="text"
            id={classes.search_input}
            placeholder="Search Users and Email"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <button id={classes.search_button} onClick={searchHandler}>
            Go
          </button>
        </div>
        {showdropdown && (
          <div className={classes.search_results_dropdown} ref={dropdownRef}>
            <ul>
              {userList.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    dispatch(
                      userActions.sender({ id: user.id, username: user.name })
                    );
                    setShowDropDown(false);
                    setSearchUser("");
                  }}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={classes.room_chat}>
          <h1>Chats</h1>
          <ul className={classes.online_users}>
            {usertalkedto.map((user, index) => (
              <li
                key={index}
                onClick={() => {
                  dispatch(chatActions.clearGroup());
                  dispatch(
                    userActions.sender({ id: user.id, username: user.name })
                  );
                }}
              >
                {user.name}{" "}
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.room_chat}>
          <h1>Online Members</h1>
          <ul className={classes.online_users}>
            {onlineusers.map((user, index) => (
              <li
                key={index}
                onClick={() => {
                  dispatch(chatActions.clearGroup());
                  dispatch(
                    userActions.sender({ id: user.id, username: user.name })
                  );
                }}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.room_tab}>
          <h1>Groups</h1>
          <ul id={classes.room_list}>
            {groups &&
              groups.map((group, id) => (
                <li
                  key={id}
                  className={classes.list_group}
                  onClick={() => {
                    dispatch(userActions.clearChattingWithUser());
                    dispatch(
                      chatActions.selectGroup({
                        groupname: group.groupname,
                        groupid: group.id,
                      })
                    );
                  }}
                >
                  {group.groupname}
                </li>
              ))}
          </ul>
          <button onClick={modalHandler}>Create Groups</button>
        </div>
        {modalopen && <Modal closemodalHandler={closemodalHandler} />}
      </div>
    </div>
  );
};

export default Sidebar;
