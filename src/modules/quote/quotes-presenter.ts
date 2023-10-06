import type { RootState } from "../../core/store";
import * as repository from "./quotes-repo";

export const loadQuote = repository.loadQuote;

export const selectQuote = (state: RootState) => {
  return state.quotesState.quotePm;
};
export const selectQuoteStatus = (state: RootState) => {
  return state.quotesState.quotePm.status;
};

export const selectQuoteVm = (state: RootState) => {
  return state.quotesState.quotePm.currentQuote;
};
