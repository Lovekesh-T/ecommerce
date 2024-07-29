import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import {
  addToCart,
  calculatePrice,
  removeCartItem,
  setDiscount,
} from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";

// const cartItems = [
//   {
//     productId: "DFLDJFLJ",
//     photo: "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg",
//     name: "macbook",
//     stock: 2,
//     price: 70000,
//     quantity: 4,
//   },
// ];

const Cart = () => {
  const dispatch = useDispatch();
  const {
    cartItems,
    subTotal,
    total,
    tax,
    shippingCharges,
    discount,
  } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const deleteHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.stock === cartItem.quantity) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity === 1) return;
    dispatch(
      addToCart({
        ...cartItem,
        quantity: cartItem.quantity - 1,
      })
    );
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOutId = setTimeout(() => {
      if (couponCode) {
        axios
          .post(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
            cancelToken,
          })
          .then((res) => {
            setIsValidCouponCode(true);
            dispatch(setDiscount(res.data.data.discount));
          })
          .catch(() => {
            setIsValidCouponCode(false);
            dispatch(setDiscount(0));
          });
      }
      // if (Math.random() > 0.5) setIsValidCouponCode(true);
      // else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, discount, dispatch]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, index) => (
            <CartItemCard
              key={index}
              cartItem={i}
              incrementHandler={incrementHandler}
              deleteHandler={deleteHandler}
              decrementHandler={decrementHandler}
            />
          ))
        ) : (
          <h1>No Items added</h1>
        )}
      </main>

      <aside>
        <p>SubTotal: ₹{subTotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
