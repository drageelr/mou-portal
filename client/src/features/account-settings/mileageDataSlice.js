import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  mileageList: [{mileageId: 1, description: 'Contact the sponsor MoU for printing merchandise', deptId: 1, ccaCheck: true, societyCheck: false}],
  isPending: true,
  error: null
}

export const fetchMileages = createAsyncThunk(
  'mileageData/fetchMileages',
  async(_, { getState, rejectWithValue}) => {
    const { isPending } = getState().mileageData
    if (!isPending) {
      return
    }

    return await apiCaller('/account/category/fetch-mileage', {}, 200,
    (data) => {
      return {isPending: false, error: '' , mileageList: data.userList}
    },
    rejectWithValue)
  }
)

export const addMileage = createAsyncThunk(
  'mileageData/addMileage',
  async (mileageObject, { rejectWithValue }) => {
    const {description, checkdeptId, checkCCA, checkSociety} = mileageObject
    return await apiCaller('/account/category/create-mileage', {
      description, 
      checkdeptId, 
      checkCCA, 
      checkSociety
    }, 201,
    (data) => {
      return {mileageId: data.mileageId, mileageObject}
    },
    rejectWithValue)   
    }
)

export const editMileage = createAsyncThunk(
  'mileageData/editMileage',
  async (mileageObject, { rejectWithValue}) => {
    const {mileageId, description, checkdeptId, checkCCA, checkSociety } = mileageObject
    let body = {
      id: mileageId,
      description, 
      checkdeptId, 
      checkCCA, 
      checkSociety
    }

    return await apiCaller('/account/category/edit-mileage', body, 203,
    (data) => {
      return {mileageId, mileageObject}
    },
    rejectWithValue)
  }
)


const mileageData = createSlice({
  name: 'mileageData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [addMileage.fulfilled]: (state, action) => {
      state.mileageList.push({
        mileageId: action.payload.mileageId, 
        ...action.payload.mileageObject
      })
      state.error = 'Mileage Added Successfully'
    },
    [addMileage.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editMileage.fulfilled]: (state, action) => {
      let i = 0
      state.mileageList.forEach((obj,index) => {
        if (obj.mileageId === action.payload.mileageId){
          i = index
        }
      })
      state.mileageList[i] = action.payload.mileageObject
      state.error = 'Mileage Edited Successfully'
    },
    [editMileage.rejected]: (state, action) => {
        state.error = action.payload
    },
    [fetchMileages.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchMileages.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.mileageList = action.payload.mileageList
      }
    },
    [fetchMileages.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const {clearError} = mileageData.actions

export default mileageData.reducer