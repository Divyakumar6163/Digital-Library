import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoaderProvider } from "./store/utils/loaderprovider";
import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from './store'; // import the store and persistor
import { store, persistor } from "./store/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LoaderProvider>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </LoaderProvider>
);
reportWebVitals();
