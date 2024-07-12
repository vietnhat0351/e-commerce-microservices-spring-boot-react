import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import newOrdersReducer from './slices/newOrdersSlice'


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    newOrders: newOrdersReducer,
  },
})