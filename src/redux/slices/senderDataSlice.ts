import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BeneficiaryDocumentDto {
    documentFor: string;
    docType: string;
    docPath: string;
    docId: string;
    docStatus: string;
    recordStatus: string;
}

interface Beneficiary {
    beneficiaryId: number;
    beneficiaryFirstName: string;
    beneficiaryMiddleName: string;
    beneficiaryLastName: string;
    beneficiaryMobile: string;
    beneficiaryPan: string;
    beneficiaryRegistrationStage?: string;
    accountName: string;
    accountNumber: string;
    accountIfsc: string;
    bankName: string;
    accountType: string;
    accountNameAsPerBank: string;
    accountVerificationTxnId: string;
    isAccountVerified: boolean;
    accountSupportingImage: string;
    createdOn: string;
    defaultAccount: boolean;
    selfAccount: boolean;
    accountVerificationStage: string;
    beneAddress: string;
    beneficiaryDocumentDto: BeneficiaryDocumentDto[];
}

interface AccountHolder {
    id: number | null;
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNumber: string;
    completeAddress: string;
    pan: string;
    accountName: string;
    accountNumber: string;
    accountIfsc: string;
    bankName: string;
    accountType: string;
    accountNameAsPerBank: string;
    accountVerificationTxnId: string;
    accountSupportingImage: string;
    recordStatus: string;
    isAccountVerified: boolean;
    registrationType: string;
    accountVerificationStage: string;
    beneficiaries: Beneficiary[];
}

interface AccountState {
    sender: AccountHolder | null;
}

const initialState: AccountState = {
    sender: null,
};

const senderData = createSlice({
    name: "sender",
    initialState,
    reducers: {
        setAccount(state, action: PayloadAction<AccountHolder>) {
            state.sender = action.payload;
        },
        clearAccount(state) {
            state.sender = null;
        },
    },
});

export const { setAccount, clearAccount } = senderData.actions;

export default senderData.reducer;
