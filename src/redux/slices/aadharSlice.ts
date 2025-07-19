import { KycResponseData } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KycState {
  kyc: KycResponseData | null;
}

const initialState: KycState = {
  kyc: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycData: (state, action: PayloadAction<KycResponseData>) => {
      state.kyc = action.payload;
    },
    clearKycData: (state) => {
      state.kyc = null;
    },
  },
});

export const { setKycData, clearKycData } = kycSlice.actions;
export default kycSlice.reducer;
