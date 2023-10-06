import type { QuoteProgrammersModel } from "./quote-types";

export const LOAD_QUOTE = "LOAD_QUOTE";

export interface LoadQuoteAction {
  type: typeof LOAD_QUOTE;
  payload: {
    quotesPm: QuoteProgrammersModel;
  };
}

export const LOAD_QUOTE_FAILURE = "LOAD_QUOTE_FAILURE";

export interface LoadQuoteFailureAction {
  type: typeof LOAD_QUOTE_FAILURE;
}

export const LOADING_QUOTE = "LOADING_QUOTE";

export interface LoadingQuoteAction {
  type: typeof LOADING_QUOTE;
}

export type AppAction =
  | LoadQuoteAction
  | LoadQuoteFailureAction
  | LoadingQuoteAction;
