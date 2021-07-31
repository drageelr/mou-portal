import { configureStore } from '@reduxjs/toolkit'
import requestListReducer from '../features/request-management/requestListSlice'
import societyDataReducer from '../features/account-settings/societyDataSlice'
import formDataReducer from '../features/form-management/formDataSlice'
import ccaDetailsReducer from '../features/account-settings/ccaDetailsSlice'
import userReducer from '../features/account-settings/userSlice'
import submissionListReducer from "../features/request-management/submissionListSlice"

export default configureStore({
  reducer: {
    requestListData: requestListReducer,
    societyData: societyDataReducer,
    ccaDetails:ccaDetailsReducer,
    formData: formDataReducer,
    user: userReducer,
    submissionListData: submissionListReducer,
  },
})
