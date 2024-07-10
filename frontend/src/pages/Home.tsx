import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { Skeleon } from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    isError,
    data: { data } = {},
  } = useLatestProductsQuery("");

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart")
  };

  if (isError) toast.error("something went wrong");

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findMore">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Skeleon width="80vw" />
        ) : (
          data?.map((product) => (
            <ProductCard
              productId={product._id}
              name={product.name}
              stock={product.stock}
              price={product.price}
              photo={`${server}/${product.photo}`}
              handler={addToCartHandler}
              key={product._id}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
