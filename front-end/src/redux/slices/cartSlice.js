import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     productIds: JSON.parse(localStorage.getItem('cart')) || [],
// };

const initialState = {
    productList: JSON.parse(localStorage.getItem('cart')) || [],
};


export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addProduct: (state, action) => {
            let isExist = false;
            // Use forEach only to check and update existing items
            state.productList.forEach(element => {
                if (element.id === action.payload.id) {
                    isExist = true;
                    element.quantity += action.payload.quantity; // Fixed the quantity update logic
                }
            });
        
            // Add new item if it doesn't exist
            if (!isExist) {
                state.productList = [...state.productList, action.payload];
            }
        
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(state.productList));
        },
        removeProduct: (state, action) => {
            state.productList = state.productList.filter((item) => item.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(state.productList));
        },
        removeAllProducts: (state) => {
            state.productList = [];
            localStorage.setItem('cart', JSON.stringify(state.productList));
        },
    },
});

export const { addProduct, removeProduct, removeAllProducts } = cartSlice.actions;

export default cartSlice.reducer;
