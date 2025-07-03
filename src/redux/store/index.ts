// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../slices/appSlice';
import checkboxReducer from '../slices/checkboxSlice';
import serviceReducer from '../slices/serviceSlice';
import endpointsReducer from '../slices/endpointsSlice';
import formReducer from '../slices/customFormSlice';
import stringValueReducer from '../slices/singleValueSlice';
import accountReducer from '../slices/senderDataSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    checkboxes: checkboxReducer,
    service: serviceReducer,
    endPoints: endpointsReducer,
    form: formReducer,
    stringValue: stringValueReducer,
    senderData: accountReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
