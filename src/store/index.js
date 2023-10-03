import {configureStore} from '@reduxjs/toolkit'
import userSlice from './user-redux'
import ChatSlice from './chat-redux'

const store = configureStore({
    reducer:{user:userSlice.reducer,chat:ChatSlice.reducer}
})

export default store    