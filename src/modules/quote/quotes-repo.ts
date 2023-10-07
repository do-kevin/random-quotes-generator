import type { QuoteProgrammersModel } from "./quote-types";
import {
  AppAction,
  LOADING_QUOTE,
  LOAD_QUOTE,
  LOAD_QUOTE_FAILURE,
} from "./quote-actions";
import type { AppDispatch, AppGetState } from "../../core/store";
import { HttpGateway } from "../../core/http-gateway";

interface QuotesState {
  quotePm: QuoteProgrammersModel;
}

const initialState: QuotesState = {
  quotePm: {
    status: "IDLE",
    currentQuote: null,
  },
};

export const loadQuote =
  () =>
  async (
    dispatch: AppDispatch,
    _getState: AppGetState,
    { httpGateway }: { httpGateway: HttpGateway }
  ) => {
    dispatch({
      type: LOADING_QUOTE,
    });

    const quoteDto = await httpGateway.get("/random");

    const quotePm = await quoteDto.json();

    if (quotePm.error) {
      dispatch({
        type: LOAD_QUOTE_FAILURE,
      });

      return null;
    }

    dispatch({
      type: LOAD_QUOTE,
      payload: {
        quotesPm: {
          status: "SUCCESS",
          currentQuote: quotePm,
        },
      },
    });
  };

const reducer = (
  quotesState = initialState,
  action: AppAction
): QuotesState => {
  switch (action.type) {
    case LOADING_QUOTE: {
      return {
        ...quotesState,
        quotePm: {
          status: "LOADING",
          currentQuote: null,
        },
      };
    }
    case LOAD_QUOTE_FAILURE: {
      return {
        ...quotesState,
        quotePm: {
          status: "FAILURE",
          currentQuote: null,
        },
      };
    }
    case LOAD_QUOTE: {
      return {
        ...quotesState,
        quotePm: action.payload.quotesPm,
      };
    }
    default: {
      return quotesState;
    }
  }
};

export default reducer;
