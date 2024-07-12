import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    newOrders: [],
};

export const newOrdersSlice = createSlice({
    name: "newOrders",
    initialState,
    reducers: {
        addMewOrders: (state, action) => {
            state.newOrders = action.payload;
        },
        removeOrder: (state, action) => {
            state.newOrders = state.newOrders.filter((order) => order.id !== action.payload.id);
        },
        removeAllOrders: (state) => {
            state.newOrders = [];
        },
    },
});

export const { addMewOrders, removeOrder, removeAllOrders } = newOrdersSlice.actions;

export default newOrdersSlice.reducer;