import React from "react";
import { Provider } from "react-redux";
import {store, persistor} from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import AppRoutes from "./AppRoutes/AppRoutes";
import { ToastContainer } from "react-toastify";




const App = () => {
  return (
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
