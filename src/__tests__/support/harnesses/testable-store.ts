import { FakeHttpGateway } from "../../../core/fake-http-gateway";
import { HttpGateway } from "../../../core/http-gateway";
import createStore from "../../../core/store";

export let store: any = null;

export const initStore = async (
  httpGateway:
    | InstanceType<typeof HttpGateway>
    | InstanceType<typeof FakeHttpGateway>
) => {
  store = createStore(httpGateway);
};

export const dispatch = async (func: unknown) => {
  await store.dispatch(func);
};

export const select = (func: any) => {
  console.log("store: ", store);

  return func(store.getState());
};
