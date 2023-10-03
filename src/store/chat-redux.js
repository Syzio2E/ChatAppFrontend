import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
    name:'chat',
    initialState:{
        grouplist:[],
        messages:[],
        group:null,
        groupid:null
    },
    reducers:{
        creategrouplist(state,action){
            state.grouplist.push(action.payload);
        },
        getgrouplist(state, action) {
            state.grouplist = action.payload;
        },
        fetchgroupmessage(state,action){
            state.messages = action.payload
        },
        getmessages(state,action){
            state.messages = state.messages.concat(action.payload);
        },
        clearMessages(state) {
            state.messages = [];
        },
        cleargrouplist(state){
            state.grouplist = []
        },
        selectGroup(state,action){
            state.group =action.payload.groupname
            state.groupid = action.payload.groupid
        },
        clearGroup(state){
            state.group=null
            state.groupid=null
        },
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
    }
})

export const chatActions = ChatSlice.actions;

export default ChatSlice;