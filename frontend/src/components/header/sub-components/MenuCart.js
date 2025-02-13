import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { getDiscountPrice } from "../../../helpers/product";
import {
  fetchCart,
  removeFromCart,
  updateCartItem,
} from "../../../store/slices/cart-slice";

const MenuCart = () => {
  const dispatch = useDispatch();
  // const currency = useSelector((state) => state.currency);
  const {
    items: cartItems,
    total,
    status,
    error,
  } = useSelector((state) => state.cart);
  let cartTotalPrice = 0;

  console.log("cartItems in cartmenu : ", cartItems);

  // Local state to prevent too many updates during input change
  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchCart()); // Fetch the latest cart on load
  }, [dispatch]);

  // quantity handler
  const handleQuantityChange = (variantId, newQuantity) => {
    dispatch(updateCartItem({ variantId, quantity: newQuantity }));
  };

  // cart item remove handler
  const cartItemDeleteHandler = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((cartItem) => (
              <li key={cartItem._id} className="single-shopping-cart">
                <div className="shopping-cart-img">
                  <img
                    alt={cartItem.variant?.images?.[0].alt}
                    src={cartItem.variant?.images?.[0].url}
                    className="img-fluid"
                  />
                </div>
                <div className="shopping-cart-title">
                  <h4>{cartItem.variant?.product?.name}</h4>
                  <h6 className="flex items-center gap-2">
                    Qty:
                    <input
                      type="number"
                      min="1"
                      value={cartItem.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          cartItem.variant?._id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-12 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </h6>
                  <span>
                    <span>{cartItem.subTotal.toFixed(2)} MVR</span>
                  </span>
                </div>
                <div className="shopping-cart-delete">
                  <button
                    onClick={() => cartItemDeleteHandler(cartItem.variant?._id)}
                  >
                    <i className="fa fa-times-circle" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Total : <span className="shop-total">{total.toFixed(2)} MVR</span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={process.env.PUBLIC_URL + "/cart"}>
              view cart
            </Link>
            <Link
              className="default-btn"
              to={process.env.PUBLIC_URL + "/checkout"}
            >
              checkout
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">No items in the cart.</p>
      )}
    </div>
  );
};

export default MenuCart;
