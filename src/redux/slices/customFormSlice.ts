/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  value: string | number | null;
}

const initialState: FormState = {
  value: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormSubmission: (
      state,
      action: PayloadAction<{ value: string | number }>
    ) => {
      state.value = action.payload.value;
    },
    resetForm: (state) => {
      state.value = null;
    },
  },
});

export const { setFormSubmission, resetForm } = formSlice.actions;

export default formSlice.reducer;
