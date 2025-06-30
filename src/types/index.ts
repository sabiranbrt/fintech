import { AxiosRequestConfig } from "axios";

export enum FieldTypes {
  TEXTFIELD = "text",
  SELECTFIELD = "dropdown",
  TEXTAREA = "area",
  CHECKBOX = 'checkbox',
  RADIOBUTTON = "radio",
  PASSFIELD = 'password',
  FILE = "file",
  CUSTOMPASS = "custompass",
  MULTISELECT = "multiSelect",
  PREVIEW = "preview"
};


export enum QuickLinksType {
  CC = "Credit Card Bill Payment",
  FW = "Fund Withdrawal",
  RP = "Rent Payment",
  EF = "Education Fees",
  FS = "Fund Settlement",
  RS = "Register Sender",
  T = "Transactions",
  TP = "Total Payout",
  LW = "Load Wallet",
  AL = "Account Ledger",
  RM = "Relationship Manager",
  RB = "Register Beneficiary"
}

export interface DynamicRequest {
  url: string;
  method: AxiosRequestConfig['method'];
  params?: Record<string, unknown>;
  headers?: TODO;
  data?: unknown;
  responseType?: TODO
}

export interface ValidationProps {
  required?: string;
  errorMessage?: string;
  validations: Validations[]
}
export interface Validations {
  regex: TODO
  errorMessage?: string;
}


export interface PennyDropIProps {
  bankIfsc: string,
  bankAccountNumber: string,
  mobileNumber: string,
  senderMobileNumber: string,
  type: string,
}
export interface AgentAccountProps {
  accountName: string,
  accountNumber: string
  accountIfsc: string,
  bankName: string,
  accountType: string,
  accountRegisterFor: string,
  accountSupportingImage: string
}

export interface TransactionsProps {
  fromDate: string
  toDate: string
  pageIndex: number
  pageSize: number
}

export interface ChargeInfoProps {
  amount: string
  selectedCardType: string
  selectedGateway: string
}

export interface LedgerProps {
  fromDate: string
  toDate: string
  reportType: string
  serviceName: string
}

// create Order
export interface RequestBody {
  requestInfo: {
    requestIp: string;
    latitude: number;
    longitude: number;
    commDeviceId: string;
    requestSource: string;
  };
  txnPayload: {
    amount: number;
    cardType: string;
  };
  dynamicValues: {
    selectedGateway: string;
    cardLastSixDigits: number;
    amount: number;
    charge: number;
    igst?: number;
    cgst?: number;
    sgst?: number;
    crdrAmount: number;
  };
}


export type EndpointConfig = {
  method: string;
  url: string;
  enc?: boolean;
  headers?: Record<string, string>;
  queryParams?: string[];
};