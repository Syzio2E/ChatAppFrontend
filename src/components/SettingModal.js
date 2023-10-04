import React, { useEffect, useState } from "react";
import "./settingModal.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserGroups } from "../store/chat-actions";
import { toast } from "react-toastify";
import { chatActions } from "../store/chat-redux";

const SettingModal = ({ closemodalHandler }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState([]);
  const nameofgroup = useSelector((state) => state.chat.group);
  const [groupname, setGroupname] = useState(nameofgroup || "");
  const groupId = useSelector((state) => state.chat.groupid);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    const getParticipants = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://3.109.133.91:8000/home/groupusers/${groupId}`,
        { headers: { Authorization: token } }
      );
      const users = response.data.participants;
      setGroupParticipants((prev) => [...prev, ...users]);
    };
    getParticipants();
  }, [groupId]);

  // Function to handle input change
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setSearch(newText);
  };

  // Function to handle result item click
  const handleResultClick = (result) => {
    setSelectedUsers((prev) => [...prev, result.name]);
    setShowResults(false);
  };

  // Function to handle removing a selected user
  const handleRemoveUser = (userName) => {
    setSelectedUsers((prev) => prev.filter((user) => user !== userName));
  };

  const handleGroupNameChange = async (e) => {
    setGroupname(e.target.value);
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (search) {
      const response = await axios.get(
        `http://3.109.133.91:8000/home?search=${search}`,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setSearchResults(response.data.users);
        setShowResults(true);
      }
    }
  };

  const handleNameChange = async () => {
    if (groupname) {
      try {
        const response = await axios.put(
          `http://3.109.133.91:8000/home/groupname/${groupId}`,
          { name: groupname },
          { headers: { Authorization: token } }
        );

        console.log("Response:", response); // Log the response

        if (response.status === 200) {
          // Successful name change
          setGroupname(response.data.groupname);
          dispatch(fetchUserGroups(token));
          dispatch(chatActions.clearGroup());
          closemodalHandler();
        } else {
          // Handle other status codes
          if (response.status === 403) {
            toast(response.data.error || "You are not authorized", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        }
      } catch (err) {
        toast.error("You are not authorized" || err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleSave = () => {
    closemodalHandler();
  };

  const deleteUserHandle = async (id) => {
    try {
      const response = await axios.delete(
        `http://3.109.133.91:8000/home/groupchat/${groupId}/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
          setGroupParticipants((prevParticipants) =>
          prevParticipants.filter((user) => user.id !== id)
        );
        console.log(response);
       
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("You are not authorized", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"> Group Settings</h5>
          </div>
          <div className="modal-body">
            <form style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <input
                  type="text"
                  id="groupname"
                  name="groupname"
                  placeholder={nameofgroup || ""}
                  value={groupname}
                  onChange={handleGroupNameChange}
                />
              </span>
              <span>
                <button
                  type="button"
                  className="btn btn-savebutton"
                  onClick={handleNameChange}
                >
                  Update Name
                </button>
              </span>
            </form>
            <form style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="search-box">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleInputChange}
                    required
                  />
                  {showResults && (
                    <div className="search-results">
                      <ul>
                        {searchResults.map((result, index) => (
                          <li
                            key={index}
                            onClick={() => handleResultClick(result)}
                          >
                            {result.name}
                            <span>
                              <button
                                type="button"
                                className="remove-user-btn"
                                onClick={() => handleRemoveUser(result.name)}
                              >
                                &times;
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="users-in-group">Participants:</p>
                  <div className="participant-list">
                    {Array.isArray(groupParticipants) &&
                      groupParticipants.map((user, index) => (
                        <div key={user.id} className="participant-item">
                          {user.name}
                          <button
                            className="close-button-setting"
                            onClick={() => deleteUserHandle(user.id)}
                          >
                            <i
                              className="fa fa-times"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <span>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSearch}
                >
                  Add Users
                </button>
              </span>
            </form>
          </div>
          <div className="selected-users">
            {selectedUsers.map((user, index) => (
              <div key={index} className="selected-user">
                {user}
                <button
                  type="button"
                  className="remove-user-btn"
                  onClick={() => handleRemoveUser(user)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={closemodalHandler}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
