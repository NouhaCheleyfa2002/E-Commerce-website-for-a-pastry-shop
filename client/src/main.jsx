
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginContextProvider from './context/LoginContext.jsx'
import CartProvider from './context/CartContext.jsx'
import WishlistProvider  from './context/WishlistContext.jsx'
import CheckoutProvider from './context/CheckoutContext.jsx'
import AdminProvider from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoginContextProvider>
      <CartProvider>
        <WishlistProvider>
          <CheckoutProvider>
            <AdminProvider>
             <App />
            </AdminProvider>       
          </CheckoutProvider>        
        </WishlistProvider>  
      </CartProvider>
    </LoginContextProvider>
  </BrowserRouter>
)
