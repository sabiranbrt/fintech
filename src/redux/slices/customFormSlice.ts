import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  senderData: TODO | null;
}

const initialState: FormState = {
  senderData: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setSenderData: (state, action: PayloadAction<TODO | null>) => {
      state.senderData = action.payload;
    },
    resetForm: (state) => {
      state.senderData = null;
    },
  },
});

export const { setSenderData, resetForm } = formSlice.actions;

export default formSlice.reducer;