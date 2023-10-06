import { LOAD_QUOTE } from "./quote-actions";

export interface LoadQuoteAction {
  type: typeof LOAD_QUOTE;
  payload: {
    quotesPm: QuoteProgrammersModel;
  };
}

export interface QuoteProgrammersModel {
  status: "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
  currentQuote: {
    author?: string;
    quote?: string;
    error?: string;
  } | null;
}
