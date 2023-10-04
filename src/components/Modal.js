import React, { useState } from "react";
import "./modal.css";
import axios from "axios";
import { createGroups } from "../store/chat-actions";
import { useDispatch } from "react-redux";

const Modal = ({ closemodalHandler }) => {
  const [groupname, setGroupname] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const dispatch = useDispatch();

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

  const handleGroupNameChange = (e) => {
    setGroupname(e.target.value);
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (search) {
      const response = await axios.get(
        `https://3.109.133.91:8000/home?search=${search}`,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        setSearchResults(response.data.users);
        setShowResults(true);
      }
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    const obj = {
      groupname,
      users: JSON.stringify(searchResults.map((u) => u.id)),
    };
    console.log(obj)
    if (obj && token) {
      dispatch(createGroups(obj, token));
      closemodalHandler();
    }
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Group</h5>
          </div>
          <div className="modal-body">
            <form style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <input
                  type="text"
                  id="groupname"
                  name="groupname"
                  placeholder="Enter group name"
                  value={groupname}
                  onChange={handleGroupNameChange}
                />
              </span>
              <span>
                <button
                  type="button"
                  className="btn btn-savebutton"
                  onClick={handleSave}
                >
                  Save
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
                </div>
              </div>
              <span>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSearch}
                >
                  Search
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

export default Modal;
