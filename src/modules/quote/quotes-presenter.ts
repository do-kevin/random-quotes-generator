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
  const currentQuote = Object.assign(
    {},
    state.quotesState.quotePm.currentQuote
  );

  if (currentQuote.author === "nknown") {
    currentQuote.author = "Unknown";
  }

  if (currentQuote.author === "uddha") {
    currentQuote.author = "Buddha";
  }

  if (currentQuote.author === "im Rohn") {
    currentQuote.author = "Jim Rohn";
  }

  return currentQuote;
};
