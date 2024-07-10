import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";

type CartItemsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  deleteHandler: (id: string) => void;
};

const CartItem = ({
  cartItem: { photo, productId, name, quantity, price, stock },
  incrementHandler,
  decrementHandler,
  deleteHandler,
}: CartItemsProps) => {
  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button
          onClick={() =>
            decrementHandler({ photo, productId, name, quantity, price, stock })
          }
        >
          -
        </button>
        <p>{quantity}</p>
        <button
          onClick={() =>
            incrementHandler({ photo, productId, name, quantity, price, stock })
          }
        >
          +
        </button>
      </div>

      <button onClick={() => deleteHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
