import { configureStore } from '@reduxjs/toolkit'
import requestListReducer from '../features/request-management/requestListSlice'
import societyDataReducer from '../features/account-settings/societyDataSlice'
import formDataReducer from '../features/form-management/formDataSlice'
import formTemplateReducer from '../features/form-management/formTemplateSlice'
import propertiesDataReducer from '../features/form-management/propertiesDataSlice'
import formListReducer from '../features/form-management/formListSlice'
import ccaDetailsReducer from '../features/account-settings/ccaDetailsSlice'
import userReducer from '../features/account-settings/userSlice'
import submissionListReducer from "../features/request-management/submissionListSlice"
import conditionalViewReducer from "../features/form-management/conditionalViewSlice"

export default configureStore({
  reducer: {
    requestListData: requestListReducer,
    societyData: societyDataReducer,
    ccaDetails:ccaDetailsReducer,
    formTemplate: formTemplateReducer,
    formData: formDataReducer,
    propertiesData: propertiesDataReducer,
    formList: formListReducer,
    user: userReducer,
    submissionListData: submissionListReducer,
    conditionalView: conditionalViewReducer
  },
})
