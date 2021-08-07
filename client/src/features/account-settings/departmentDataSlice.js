import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  departmentList: [{departmentId: 1, name: 'LUMUN'}],
  isPending: true,
  error: null
}

export const fetchDepartments = createAsyncThunk(
  'departmentData/fetchDepartments',
  async(_, { getState, rejectWithValue}) => {
    const { isPending } = getState().departmentData
    if (!isPending) {
      return
    }

    return await apiCaller('/dept/fetch', {}, 200,
    (data) => {
      return {isPending: false, error: '' , departmentList: data.userList}
    },
    rejectWithValue)
  }
)

export const addDepartment = createAsyncThunk(
  'departmentData/addDepartment',
  async (departmentObject, { rejectWithValue }) => {
    const { name } = departmentObject
    return await apiCaller('/dept/create', {
      name: name
    }, 201,
    (data) => {
      return {departmentId: data.departmentId, departmentObject}
    },
    rejectWithValue)   
    }
)

export const editDepartment = createAsyncThunk(
  'departmentData/editDepartment',
  async (departmentObject, { rejectWithValue}) => {
    const {departmentId, name } = departmentObject
    let body = {
      departmentId: departmentId,
      name: name
    }
    return await apiCaller('/dept/edit', body, 203,
    (data) => {
      return {departmentId, departmentObject}
    },
    rejectWithValue)
  }
)


const departmentData = createSlice({
  name: 'departmentData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [addDepartment.fulfilled]: (state, action) => {
      state.departmentList.push({
        departmentId: action.payload.departmentId, 
        ...action.payload.departmentObject
      })
      state.error = 'Department Added Successfully'
    },
    [addDepartment.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editDepartment.fulfilled]: (state, action) => {
      let i = 0
      state.departmentList.forEach((obj,index) => {
        if (obj.departmentId === action.payload.departmentId){
          i = index
        }
      })
      state.departmentList[i] = action.payload.departmentObject
      state.error = 'Department Edited Successfully'
    },
    [editDepartment.rejected]: (state, action) => {
        state.error = action.payload
    },
    [fetchDepartments.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchDepartments.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.departmentList = action.payload.departmentList
      }
    },
    [fetchDepartments.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const {clearError} = departmentData.actions

export default departmentData.reducer