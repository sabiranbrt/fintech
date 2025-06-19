/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BankDetails {
  bankName: {
    bankName: string;
    ifsc: string;
    mode: string;
  };
  IFSC: string;
  cardAccount: string;
  mobileNumber: string;
}

interface FormState {
  cusVal: BankDetails | null;
}

const initialState: FormState = {
  cusVal: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormSubmission: (state, action: PayloadAction<{ value: BankDetails | null }>) => {
      state.cusVal = action.payload.value;
    },
    resetForm: (state) => {
      state.cusVal = null;
    },
  },
});

export const { setFormSubmission, resetForm } = formSlice.actions;

export default formSlice.reducer;