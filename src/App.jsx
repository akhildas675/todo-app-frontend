import React from "react";
import { Provider } from "react-redux";
import store from "./app/store";
import AppRoutes from "./AppRoutes/AppRoutes";

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <AppRoutes />
      </div>
    </Provider>
  );
};

export default App;
