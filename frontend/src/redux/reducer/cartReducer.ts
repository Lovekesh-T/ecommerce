import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  shippingInfo: {
    address: "",
    state: "",
    city: "",
    country: "",
    pinCode: "",
  },
  subTotal: 0,
  total: 0,
  shippingCharges: 0,
  tax: 0,
  discount: 0,
};
export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.loading = true;
      const index = state.cartItems.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (index !== -1) {
        state.cartItems[index] = action.payload;
      } else {
        state.cartItems.push(action.payload);
      }
      state.loading = false;
    },
    removeCartItem(state, action: PayloadAction<string>) {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
      state.loading = false;
    },
    calculatePrice: (state) => {
      const subTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subTotal = subTotal;
      state.shippingCharges = state.subTotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subTotal * 0.18);
      state.total =
        state.subTotal + state.tax + state.shippingCharges - state.discount;
    },
    setDiscount(state, action: PayloadAction<number>) {
      state.discount = action.payload;
    },
    saveShippingInfo(state, action: PayloadAction<ShippingInfo>) {
      state.shippingInfo = action.payload;
    },
    resetCart() {
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  setDiscount,
  saveShippingInfo,
  resetCart,
} = cartReducer.actions;
