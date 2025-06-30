export interface BeneficiaryDocumentDto {
  documentFor: string;
  docType: string;
  docPath: string;
  docId: string;
  docStatus: string;
  recordStatus: string;
}

export interface Beneficiary {
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
  accountRegisterFor: string;
  accountLimit: number;
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

export interface AccountData {
  id: number;
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
  accountRegisterFor: string;
  accountLimit: number;
  accountNameAsPerBank: string;
  accountVerificationTxnId: string;
  accountSupportingImage: string;
  recordStatus: string;
  isAccountVerified: boolean;
  registrationType: string;
  accountVerificationStage: string;
  beneficiaries: Beneficiary[];
}
