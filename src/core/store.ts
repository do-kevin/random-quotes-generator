import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import quotesRepo from "../modules/quote/quotes-repo";
import { AppAction } from "../modules/quote/quote-actions";

import { FakeHttpGateway } from "./fake-http-gateway";
import { HttpGateway } from "./http-gateway";

const rootReducer = combineReducers({
  quotesState: quotesRepo,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<
  RootState,
  InstanceType<typeof HttpGateway>,
  AppAction
>;

export type DispatchFunc = () => AppDispatch;

export const useAppDispatch: DispatchFunc = useDispatch;

export type AppGetState = () => RootState;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const store = (
  httpGateway:
    | InstanceType<typeof HttpGateway>
    | InstanceType<typeof FakeHttpGateway>
) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            httpGateway: httpGateway,
          },
        },
      }),
  });
};

export default store;
