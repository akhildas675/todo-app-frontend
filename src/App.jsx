import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage"; 
import { Provider } from "react-redux";
import store from "./app/store";

const App = () => {
  return (
    <Provider store={store}>


      <BrowserRouter>
        <Routes>


          <Route path="/" element={<AuthPage />} />

          <Route path="/home" element={<HomePage />} />


        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
