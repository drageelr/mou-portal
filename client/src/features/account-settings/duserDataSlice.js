import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  duserList: [{duserId: 1, name: 'Hammad Nasir', departmentId: 1, email: 'hammad.nasir@lums.edu.pk', password: 'hammad123'}],
  isPending: true,
  error: null
}

export const fetchDUserAccounts = createAsyncThunk(
  'duserData/fetchDUserAccounts',
  async(_, { getState, rejectWithValue}) => {
    const { isPending } = getState().duserData
    if (!isPending) {
      return
    }

    return await apiCaller('/api/account/duser/fetch', {}, 200,
    (data) => {
      return {isPending: false, error: '' , duserList: data.userList}
    },
    rejectWithValue)
  }
)

export const addDUserAccount = createAsyncThunk(
  'duserData/addDUserAccount',
  async (duserObject, { rejectWithValue }) => {
    const {name, email, password} = duserObject
    return await apiCaller('/api/account/duser/create', {
      name: name,
      email: email,
      password: password
    }, 201,
    (data) => {
      return {duserId: data.duserId, duserObject}
    },
    rejectWithValue)   
    }
)

export const editDUserAccount = createAsyncThunk(
  'duserData/editDUserAccount',
  async (duserObject, { rejectWithValue}) => {
    const {duserId, name, email, password } = duserObject
    let body = {
      duserId: duserId,
      name: name,
      email: email,
    }
    if (password !== undefined){
      body = {...body, password: password}
    }
    return await apiCaller('/api/account/duser/edit', body, 203,
    (data) => {
      return {duserId, duserObject}
    },
    rejectWithValue)
  }
)


const duserData = createSlice({
  name: 'duserData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [addDUserAccount.fulfilled]: (state, action) => {
      state.duserList.push({
        duserId: action.payload.duserId, 
        ...action.payload.duserObject
      })
      state.error = 'Department Member Added Successfully'
    },
    [addDUserAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editDUserAccount.fulfilled]: (state, action) => {
      let i = 0
      state.duserList.forEach((obj,index) => {
        if (obj.duserId === action.payload.duserId){
          i = index
        }
      })
      state.duserList[i] = action.payload.duserObject
      state.error = 'Department Member Edited Successfully'
    },
    [editDUserAccount.rejected]: (state, action) => {
        state.error = action.payload
    },
    [fetchDUserAccounts.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchDUserAccounts.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.duserList = action.payload.duserList
      }
    },
    [fetchDUserAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const {clearError} = duserData.actions

export default duserData.reducer