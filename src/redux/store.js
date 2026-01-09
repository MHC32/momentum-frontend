import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'
import taskReducer from './slices/taskSlice'
import goalReducer from './slices/goalSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    goals: goalReducer,
  },
})