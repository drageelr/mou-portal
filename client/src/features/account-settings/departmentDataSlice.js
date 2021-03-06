import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  departmentList: [{deptId: 1, name: 'LUMUN'}],
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

    return await apiCaller('/api/account/dept/fetch', {}, 200,
    (data) => {
      return {isPending: false, error: '' , departmentList: data.departments}
    },
    rejectWithValue)
  }
)

export const addDepartment = createAsyncThunk(
  'departmentData/addDepartment',
  async (departmentObject, { rejectWithValue }) => {
    const { name } = departmentObject
    return await apiCaller('/api/account/dept/create', {
      name: name
    }, 200,
    (data) => {
      return {deptId: data.id, departmentObject}
    },
    rejectWithValue)   
    }
)

export const editDepartment = createAsyncThunk(
  'departmentData/editDepartment',
  async (departmentObject, { rejectWithValue}) => {
    const {deptId, name } = departmentObject
    let body = {
      id: deptId,
      name: name
    }
    return await apiCaller('/api/account/dept/edit', body, 200,
    (data) => {
      return {deptId, departmentObject}
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
        deptId: action.payload.deptId, 
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
        if (obj.deptId === action.payload.deptId){
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