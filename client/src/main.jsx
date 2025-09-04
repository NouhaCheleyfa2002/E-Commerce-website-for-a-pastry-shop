import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginContextProvider from './context/LoginContext.jsx'
import CartProvider from './context/CartContext.jsx'
import WishlistProvider  from './context/WishlistContext.jsx'
import CheckoutProvider from './context/CheckoutContext.jsx'
import AdminProvider from './context/AdminContext.jsx'
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./adminDashboard/state";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./adminDashboard/state/api.js";


const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
setupListeners(store.dispatch);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <LoginContextProvider>
        <WishlistProvider>
          <CheckoutProvider>
           <CartProvider>
             <AdminProvider>
              <App />
             </AdminProvider>  
            </CartProvider>     
          </CheckoutProvider>        
        </WishlistProvider>      
    </LoginContextProvider>
  </Provider>
  </BrowserRouter>
)
