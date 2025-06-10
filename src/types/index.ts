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
    LP = "Load Wallet",
    AL = "Account Ledger",
    RM = "Relationship Manager"
}

export interface DynamicRequest {
    url: string;
    method: AxiosRequestConfig['method'];
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    data?: unknown;
}

export interface ValidationProps {
  required?: string;
  errorMessage?: string;
  validations: Validations[]
}
export interface Validations {
  regex: string
  errorMessage?: string;
}
