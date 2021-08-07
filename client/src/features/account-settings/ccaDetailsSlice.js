import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  ccaList : [{
    ccaId: 1, 
    name: 'Ashar', 
    email: 'ashar.javaid@lums.edu.pk',
    password: 'ashar123', 
    designation: 'Admin',
    permissions: {
      accountAccess: true,
      approvalAccess: true,
      reviewAccess: true,
      verifyAccess: true,
      cancelAccess: true,
      logAccess: true,
      categoryAccess: true
    }
  }],
  isPending: true,
  error: null
}

export const fetchCCAAccounts = createAsyncThunk(
  'ccaDetails/fetchCCAAccounts',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().ccaDetails
    if (!isPending) {
      return
    } 

    return await apiCaller('/cca/fetch', {}, 200,
    (data) => ({isPending: false, error: '' , ccaList: data.userList}),
    rejectWithValue)
  }
)

export const editCCAPermissions = createAsyncThunk(
  'ccaDetails/editCCAPermissions',
  async ({ccaId, permissions}, { rejectWithValue }) => {

    return await apiCaller('/cca/edit-access', {
      ccaId: ccaId,
      permissions: permissions
    }, 203,
    (data) => ({ccaId, permissions}),
    rejectWithValue)
  }
)

export const editCCAAccount = createAsyncThunk(
  'ccaDetails/editCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const {ccaId, name, designation, email, password} = ccaObject 
    let body = {
      ccaId: ccaId,
      email: email,
      name: name,
      designation: designation
    }
    if (password !== undefined){
      body = {...body, password: password}
    }

    return await apiCaller('/cca/edit', body, 203,
    (data) => ({ccaId, ccaObject}),
    rejectWithValue)
  }
)

export const addCCAAccount = createAsyncThunk(
  'ccaDetails/addCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const { name, designation, email, password,  permissions } = ccaObject
    
    return await apiCaller('/cca/create', {
      email: email,
      password: password,
      name: name,
      designation: designation,
      permissions: permissions
    }, 201,
    (data) => ({ccaId: data.ccaId, ccaObject}),
    rejectWithValue)
  }
)

const ccaDetails = createSlice({
  name: 'ccaDetails',
  initialState: initialState,
  reducers: {
    clearError: (state, action) => {
      state.error = null
    },
  },
  extraReducers: {
    [editCCAAccount.fulfilled]: (state, action) => {
      let i = 0
      state.ccaList.forEach((obj,index) => {
        if (obj.ccaId === action.payload.ccaId){
          i = index
        }
      })
      state.ccaList[i] = action.payload.ccaObject
      state.error = 'CCA Account Edited Successfully'
    },
    [editCCAAccount.rejected]: (state, action) => {
      state.error = action.payload
    },
    
    [addCCAAccount.fulfilled]: (state, action) => {
      state.ccaList.push({
        ccaId: action.payload.ccaId, 
        ...action.payload.ccaObject
      })
      state.error = 'CCA Account Added Successfully'
    },
    [addCCAAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [fetchCCAAccounts.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCCAAccounts.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.ccaList = action.payload.ccaList 
        // state.error = 'Fetched all CCA Accounts'
      }
    },
    [fetchCCAAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [editCCAPermissions.fulfilled]: (state, action) => {
      state.ccaList.forEach((obj,index) => {
        if (obj.ccaId === action.payload.ccaId){
          state.ccaList[index].permissions = action.payload.permissions
        }  
      })
      state.error = 'CCA Account Permissions Edited'
    },
    [editCCAPermissions.rejected]: (state, action) => {
        state.error = action.payload
    },

    
  } 
})

export const { clearError } = ccaDetails.actions

export default ccaDetails.reducer