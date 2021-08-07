import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from "../../helpers"

const initialState = {
  id: -1,
  email: "",
  password: "",
  name: "",
  designation: "",
  initials: "",
  userType: "cca", // society, guser
  isLoggedIn: false,
  themeColor: '#01bc8d',
  darkMode: false,
  token: "",
  permissions: {
    accountAccess: true,
    approvalAccess: true,
    reviewAccess: true,
    verifyAccess: true,
    cancelAccess: true,
    logAccess: true,
    categoryAccess: true
  },
  isPending: true,
  error: null
}

export const login = createAsyncThunk(
  'user/login',
  async({email, password, userType}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (!isPending){
      return
    }

    let QUERY = '/api/auth/login';

    return await apiCaller(QUERY, {email, password, type: userType}, 200,
    (data)=> {
      const {token, name, designation, initials} = data;
      localStorage.setItem('token', data.token)
      
      if (userType==="cca"){
        return {token, email, userType, password, name, designation}
      }
      else if (userType == "society"){
        return {token, email, userType, password, name, initials}
      }
      else if (userType == "guser"){
        return {token, email, userType, password, name}
      }
    },rejectWithValue)
  }
)



export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async({email, userType}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (!isPending){
      return
    }

    return await apiCaller('/api/auth/forgot-password', {
      email,
      type: userType,
    }, 200,
    (data) => {
      return {email}
    },
    rejectWithValue)
  }
)


export const changePassword = createAsyncThunk(
  'user/changePassword',
  async({currentPassword, newPassword}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (!isPending){
      return
    }

    return await apiCaller('/api/account/change-password', {
      oldPassword: currentPassword,
      newPassword: newPassword,
    }, 200,
    (data) => {
      return {newPassword}
    },
    rejectWithValue)
  }
)



const user = createSlice ({
  name:'user',
  initialState: initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("token")
      localStorage.removeItem("localUser")
      return initialState
    },
    clearError: (state, action) => {
      state.error = null
    },

    setUserDetails: (state, action) => {
      state.userType = action.payload.userType
      state.isLoggedIn = action.payload.isLoggedIn
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
    }
  },
  extraReducers: {
    
    [login.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [login.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        return {
          ...action.payload,
          isLoggedIn: true,
          isPending: false,
          error: null
        }
      }
    },
    [login.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
    
    
    [changePassword.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [changePassword.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.password = action.payload.newPassword
        state.error = "Changed password successfully."
      }
    },
    [changePassword.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },


    [forgotPassword.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [forgotPassword.fulfilled]: (state, action) => {
      if (state.isPending === true) { 
        state.error = "Password reset email sent to " + action.payload.email + " successfully."
      }
    },
    [forgotPassword.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
  }
})

export const { logout, clearError, setUserDetails } = user.actions

export default user.reducer