
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LoaderProps {
    isLoading: boolean;
}

const initialState: LoaderProps = {
    isLoading: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateLoading(state, action: PayloadAction<LoaderProps>) {
            const { isLoading } = action.payload;
            state.isLoading = isLoading;
        },

    },
});

export const { updateLoading } = appSlice.actions;
export default appSlice.reducer;
