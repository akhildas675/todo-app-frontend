import React from "react";
import { Provider } from "react-redux";
import store from "./app/store";
import AppRoutes from "./AppRoutes/AppRoutes";
import { ToastContainer } from "react-toastify";




const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
