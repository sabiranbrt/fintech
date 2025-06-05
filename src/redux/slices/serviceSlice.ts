import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Service {
    label: string;
    key: string;
    alias: string;
    type: string;
    uploadSlip: boolean;
    sequence: string[];
}

const serviceSlice = createSlice({
    name: 'services',
    initialState: {
        selectedService: null as Service | null,
        isText: null as string | null,
    },
    reducers: {
        setSelectedService: (state, action: PayloadAction<Service | null>) => {
            state.selectedService = action.payload;
        },
        updateIsText: (state, action: PayloadAction<string | null>) => {
            state.isText = action.payload;
        },
        clearSelection: (state) => {
            state.selectedService = null;
            state.isText = null;
        },
    }
});

export const { updateIsText, setSelectedService } = serviceSlice.actions;
export default serviceSlice.reducer;
