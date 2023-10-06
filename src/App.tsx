import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";

import { Provider } from "react-redux";
import createStore from "./core/store";
import { HttpGateway } from "./core/http-gateway";
import { Config } from "./core/config";
import { QuoteScreen } from "./modules/quote/QuoteScreen";

function App() {
  const config = new Config();
  const httpGateway = new HttpGateway(config);

  const store = createStore(httpGateway);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <QuoteScreen />,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
