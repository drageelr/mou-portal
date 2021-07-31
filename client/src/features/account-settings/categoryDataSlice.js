import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  categoryList: [{categoryId: 1, name: 'Bronze', lowerBound: 0, upperBound: 50000}],
  isPending: true,
  error: null
}

export const fetchCategories = createAsyncThunk(
  'categoryData/fetchCategories',
  async(_, { getState, rejectWithValue}) => {
    const { isPending } = getState().categoryData
    if (!isPending) {
      return
    }

    return await apiCaller('/api/account/category/fetch', {}, 200,
    (data) => {
      return {isPending: false, error: '' , categoryList: data.userList}
    },
    rejectWithValue)
  }
)

export const addCategory = createAsyncThunk(
  'categoryData/addCategory',
  async (categoryObject, { rejectWithValue }) => {
    const {name, email, password} = categoryObject
    return await apiCaller('/api/account/category/create', {
      name: name,
      email: email,
      password: password
    }, 201,
    (data) => {
      return {categoryId: data.categoryId, categoryObject}
    },
    rejectWithValue)   
    }
)

export const editCategory = createAsyncThunk(
  'categoryData/editCategory',
  async (categoryObject, { rejectWithValue}) => {
    const {categoryId, name, email, password } = categoryObject
    let body = {
      categoryId: categoryId,
      name: name,
      email: email,
    }
    if (password !== undefined){
      body = {...body, password: password}
    }
    return await apiCaller('/api/account/category/edit', body, 203,
    (data) => {
      return {categoryId, categoryObject}
    },
    rejectWithValue)
  }
)


const categoryData = createSlice({
  name: 'categoryData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [addCategory.fulfilled]: (state, action) => {
      state.categoryList.push({
        categoryId: action.payload.categoryId, 
        ...action.payload.categoryObject
      })
      state.error = 'Department Member Added Successfully'
    },
    [addCategory.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editCategory.fulfilled]: (state, action) => {
      let i = 0
      state.categoryList.forEach((obj,index) => {
        if (obj.categoryId === action.payload.categoryId){
          i = index
        }
      })
      state.categoryList[i] = action.payload.categoryObject
      state.error = 'Department Member Edited Successfully'
    },
    [editCategory.rejected]: (state, action) => {
        state.error = action.payload
    },
    [fetchCategories.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCategories.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.categoryList = action.payload.categoryList
      }
    },
    [fetchCategories.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const {clearError} = categoryData.actions

export default categoryData.reducer