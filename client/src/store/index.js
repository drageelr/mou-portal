import { configureStore } from '@reduxjs/toolkit'
import requestListReducer from '../features/request-management/requestListSlice'
import societyDataReducer from '../features/account-settings/societyDataSlice'
import formDataReducer from '../features/form-management/formDataSlice'
import departmentDataReducer from '../features/account-settings/departmentDataSlice'
import duserDataReducer from '../features/account-settings/duserDataSlice'
import ccaDetailsReducer from '../features/account-settings/ccaDetailsSlice'
import userReducer from '../features/account-settings/userSlice'
import submissionListReducer from "../features/request-management/submissionListSlice"

export default configureStore({
  reducer: {
    requestListData: requestListReducer,
    societyData: societyDataReducer,
    ccaDetails:ccaDetailsReducer,
    departmentData: departmentDataReducer,
    duserData: duserDataReducer,
    formData: formDataReducer,
    user: userReducer,
    submissionListData: submissionListReducer,
  },
})
