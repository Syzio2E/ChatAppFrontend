import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:'user',
    initialState:{
        token:null,
        LoggedInUser:'',
        chattingwith:'',
        senderid:'',
        userId:''
    },
    reducers:{
        login(state,action){
            state.token=action.payload.token
            state.LoggedInUser = action.payload.username
            state.userId= action.payload.id
        },
        logout(state){
            state.token = null
           state.LoggedInUser = ''
           state.chattingwith = ''
           state.senderid = ''
           state.userId=''
        },
        sender(state,action){
            state.chattingwith = action.payload.username
            state.senderid = action.payload.id
        },
        clearChattingWithUser(state){
            state.chattingwith= null
            state.senderid = null
        },
      
    }
})

export const userActions = userSlice.actions
export default userSlice