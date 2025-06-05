// checkboxSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CheckboxState {
  selectedValues: string[];
}

const initialState: CheckboxState = {
  selectedValues: []
};

export const checkboxSlice = createSlice({
  name: 'checkboxes',
  initialState,
  reducers: {
    toggleCheckbox: (state, action: PayloadAction<string>) => {
      const value = action.payload;
      const index = state.selectedValues.indexOf(value);
      
      if (index === -1) {
        state.selectedValues.push(value);
      } else {
        state.selectedValues.splice(index, 1);
      }
    },
    clearSelection: (state) => {
      state.selectedValues = [];
    }
  }
});

export const { toggleCheckbox, clearSelection } = checkboxSlice.actions;
export default checkboxSlice.reducer;