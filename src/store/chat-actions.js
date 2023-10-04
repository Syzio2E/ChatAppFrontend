import { chatActions } from "./chat-redux";
import axios from "axios";
import { userActions } from "./user-redux";


export const getSelectedUserMessage=(id,token)=>{
    return async(dispatch)=>{
        try {
            const response = await axios.get(`http://3.109.133.91:8000/home/${id}`,{headers:{Authorization:token}})
            const messages = response.data.chats;
            dispatch(chatActions.getmessages(messages))
            
        } catch (error) {
            console.log(error)
        }
    }
    }

export const createGroups = (obj, token) => {
    return async (dispatch) => {
      try {
        const response = await axios.post(
          'http://3.109.133.91:8000/home/creategroup',
          obj,
          { headers: { Authorization: token } }
        );
        if (response.status === 201) {
          const { groupname, id } = response.data.chat;
          dispatch(chatActions.creategrouplist({ groupname, id }));
          dispatch(userActions.clearChattingWithUser());
          dispatch(chatActions.selectGroup({ groupname, groupid: id }));
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  
  export const fetchUserGroups = (token) => {
    return async (dispatch) => {
      try {
        const response = await axios.get('http://3.109.133.91:8000/home/getgroup', {
          headers: { Authorization: token },
        });
        
        if (response.status === 200) {
          const groups = response.data.map((group) => ({
            groupname: group.groupname,
            id: group.id,
          }));
          dispatch(chatActions.getgrouplist(groups));
        }
      } catch (error) {
        console.log(error);
      }
    };
  };


  export const UserGroupMessages = (groupId, token, obj) => {
    return async (dispatch) => {
      try {
        if(!obj || !obj.message){
          return;
        }
        const response = await axios.post(
          `http://3.109.133.91:8000/home/groupmessage/${groupId}`,
          obj,
          { headers: { Authorization: token } }
        );
        if (response.status === 201) {
          const messages = response.data.chat; 
          dispatch(chatActions.getmessages(messages));
          return messages
        }
      } catch (error) {
        console.log(error);
      }
    };
  };

// sending user messages one on one
export const userSingleChat=(id,token,obj)=>{
    return async(dispatch)=>{
        try {
            const response = await axios.post(`http://3.109.133.91:8000/home/${id}`,obj,{headers:{Authorization:token}})
            if(response.status===200){
                dispatch(chatActions.getmessages(response.data.chatMessage))
                return response.data.chatMessage
            }
            
        } catch (error) {
            console.log(error)
        }
    }
}



export const getGroupMessages = (groupId, token) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://3.109.133.91:8000/home/groupchatmessages/${groupId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        const chatMessages = response.data.chats;
        dispatch(chatActions.fetchgroupmessage(chatMessages));
      }
    } catch (error) {
      console.error(error);
    }
  };
};