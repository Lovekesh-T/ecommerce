import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { NewOrderRequest } from "../types/api.types";
import { useDispatch, useSelector } from "react-redux";
import {
  CartReducerInitialState,
  UserReducerInitialState,
} from "../types/reducer-types";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/feature";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
  const {
    cartReducer: {
      cartItems,
      total,
      subTotal,
      tax,
      discount,
      shippingCharges,
      shippingInfo,
    },
    userReducer: { user },
  } = useSelector(
    (state: {
      cartReducer: CartReducerInitialState;
      userReducer: UserReducerInitialState;
    }) => state
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [newOrder] = useNewOrderMutation();
  const dispatch = useDispatch();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const order: NewOrderRequest = {
      orderItems:cartItems,
      total,
      subTotal,
      tax,
      discount,
      shippingCharges,
      shippingInfo,
      user: user?._id as string,
    };
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "something went wrong");
    }

    if (paymentIntent.status === "succeeded") {
      console.log("Placing Order");
      const res = await newOrder(order);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
    }

    setIsProcessing(false);
  };
  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button disabled={isProcessing}>
          {isProcessing ? "Processing" : "Pay"}
        </button>
      </form>
    </div>
  );
};
const CheckOut = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;
  if (!clientSecret) return <Navigate to={"/shipping"} />;

  const options = {
    // passing the client secret obtained from the server
    clientSecret,
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckOutForm />
    </Elements>
  );
};

export default CheckOut;
