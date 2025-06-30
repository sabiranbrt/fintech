// store/endpointSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EndpointState {
    endpoints: Record<string, TODO> | null;
}

const initialState: EndpointState = {
    endpoints: JSON.parse(localStorage.getItem('endpoints') || 'null'),
};

const endpointSlice = createSlice({
    name: 'endpoints',
    initialState,
    reducers: {
        setEndpoints(state, action: PayloadAction<Record<string, TODO>>) {
            state.endpoints = action.payload;
            localStorage.setItem('endpoints', JSON.stringify(action.payload));
        },
        clearEndpoints(state) {
            state.endpoints = null;
            localStorage.removeItem('endpoints');
        },
    },
});

export const { setEndpoints, clearEndpoints } = endpointSlice.actions;
export default endpointSlice.reducer;
