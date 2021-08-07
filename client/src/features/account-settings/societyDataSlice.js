import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  societyList: [{societyId: 1, name: 'LUMS Model United Nations', initials: 'LUMUN', email: 'lumun@lums.edu.pk'}],
  isPending: true,
  error: null
}

export const fetchSocietyAccounts = createAsyncThunk(
  'societyData/fetchSocietyAccounts',
  async(_, { getState, rejectWithValue}) => {
    const { isPending } = getState().societyData
    if (!isPending) {
      return
    }

    return await apiCaller('/api/account/society/fetch', {}, 200,
    (data) => {
      return {isPending: false, error: '' , societyList: data.users}
    },
    rejectWithValue)
  }
)

export const addSocietyAccount = createAsyncThunk(
  'societyData/addSocietyAccount',
  async (societyObject, { rejectWithValue }) => {
    const { name, initials, email } = societyObject
    return await apiCaller('/api/account/society/create', {
      email,
      initials,
      name
    }, 200,
    (data) => {
      return {societyId: data.id, societyObject}
    },
    rejectWithValue)   
    }
)

export const editSocietyAccount = createAsyncThunk(
  'societyData/editSocietyAccount',
  async (societyObject, { rejectWithValue}) => {
    const {societyId, name, initials, email} = societyObject
    let body = {
      id: societyId,
      name,
      initials,
      email,
    }

    return await apiCaller('/api/account/society/edit', body, 200,
    (data) => {
      return {societyId, societyObject}
    },
    rejectWithValue)
  }
)


const societyData = createSlice({
  name: 'societyData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [addSocietyAccount.fulfilled]: (state, action) => {
      state.societyList.push({
        societyId: action.payload.societyId, 
        ...action.payload.societyObject
      })
      state.error = 'Society Account Added Successfully'
    },
    [addSocietyAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editSocietyAccount.fulfilled]: (state, action) => {
      let i = 0
      state.societyList.forEach((obj,index) => {
        if (obj.societyId === action.payload.societyId){
          i = index
        }
      })
      state.societyList[i] = action.payload.societyObject
      state.error = 'Society Account Edited Successfully'
    },
    [editSocietyAccount.rejected]: (state, action) => {
        state.error = action.payload
    },
    [fetchSocietyAccounts.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchSocietyAccounts.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.societyList = action.payload.societyList
      }
    },
    [fetchSocietyAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const {clearError} = societyData.actions

export default societyData.reducer