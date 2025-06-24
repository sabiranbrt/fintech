// stringValueSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StringValueState {
  value: string;
}

const initialState: StringValueState = {
  value: ''
};

export const stringValueSlice = createSlice({
  name: 'stringValue',
  initialState,
  reducers: {
    setValues: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearValue: (state) => {
      state.value = '';
    }
  }
});

export const { setValues, clearValue } = stringValueSlice.actions;
export default stringValueSlice.reducer;
