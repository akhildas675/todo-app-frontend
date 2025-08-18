import React from 'react';

import { BrowserRouter,Router } from 'react-router-dom';


import AuthPage from './pages/AuthPage';
import { Provider } from 'react-redux';
import store from './app/store';

const App = () => {
  return (
    <div>

      <Provider store={store}>



      <AuthPage/>
      
      
      </Provider>
    </div>
  );
}

export default App;
