import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from "../../helpers"

const initialState = {
  id: -1,
  email: "",
  password: "",
  name: "",
  designation: "",
  userType: "CCA", // Society, General
  isLoggedIn: true,
  themeColor: '#00b489',
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

    let QUERY = '/api/auth/cca/login';

    if (userType === "Society") {
      QUERY = '/api/auth/society/login';
    }
    else if (userType === "General") {
      QUERY = '/api/auth/general/login';
    }

    return await apiCaller(QUERY, {email, password}, 200,
    (data)=> {
      localStorage.setItem('token', data.token)

      if (userType==="CCA"){
        return {token: data.token, user: {email, userType, password, name: data.user.name,...data.user},}
      }
      else {
        return {token: data.token, user: {email, userType, password, ...data.user},}
      }
    },rejectWithValue)
  }
)


export const changePassword = createAsyncThunk(
  'user/changePassword',
  async({currentPassword, newPassword}, {getState, rejectWithValue}) => {
    const {isPending, userType} = getState().user
    if (!isPending){
      return
    }

    const QUERY = (userType === "Society") ? '/api/account/society/change-password' : '/api/account/cca/change-password'

    return await apiCaller(QUERY, {
      passwordCurrent: currentPassword,
      passwordNew: newPassword,
    }, 203,
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
          ...action.payload.user,
          role: "admin",
          token: action.payload.token,
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
        state.password = action.payload
        state.error = "Changed Password Successfully"
      }
    },
    [changePassword.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
  }
})

export const { logout, clearError, setUserPicture, setUserDetails } = user.actions

export default user.reducer