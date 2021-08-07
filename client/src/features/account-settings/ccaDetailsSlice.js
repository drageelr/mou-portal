import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  ccaList : [{
    ccaId: 1, 
    name: 'Ashar', 
    email: 'ashar.javaid@lums.edu.pk',
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



export const addCCAAccount = createAsyncThunk(
  'ccaDetails/addCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const { name, designation, email, permissions } = ccaObject
    
    return await apiCaller('/api/account/cca/create', {
      email,
      name,
      designation,
      // permissions
    }, 200,
    (data) => ({ccaId: data.id, ccaObject}),
    rejectWithValue)
  }
)


export const fetchCCAAccounts = createAsyncThunk(
  'ccaDetails/fetchCCAAccounts',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().ccaDetails
    if (!isPending) {
      return
    } 

    return await apiCaller('/api/account/cca/fetch', {}, 200,
    (data) => {
      let {users, userAccess} = data;
      let ccaList = []; // merge users and userAccess (permissions) arrays into one based on id

      for(let i=0; i<users.length; i++) {
        ccaList.push({
        ...users[i], 
        permissions: (userAccess.find((ua) => ua.id === users[i].id))
        });
      }

      return {isPending: false, error: '' , ccaList}
    },
    rejectWithValue)
  }
)


export const editCCAAccount = createAsyncThunk(
  'ccaDetails/editCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const {ccaId, name, designation, email} = ccaObject 
    let body = {
      id: ccaId,
      name,
      email,
      designation,
    }

    return await apiCaller('/api/account/cca/edit', body, 200,
    (data) => ({ccaId, ccaObject}),
    rejectWithValue)
  }
)


export const editCCAPermissions = createAsyncThunk(
  'ccaDetails/editCCAPermissions',
  async ({ccaId, permissions}, { rejectWithValue }) => {

    return await apiCaller('/api/account/cca/edit-access', {
      id: ccaId,
      ...permissions // account, approval, review, verify, cancel, log, category
    }, 200,
    (data) => ({ccaId, permissions}),
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
      }
    },
    [fetchCCAAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },



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