import React, { Fragment, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutOne from "../../layouts/LayoutOne";
import { cancelOrder, fetchOrders } from "../../store/slices/order-slice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../../store/slices/cart-slice";
import { fetchProductDetails } from "../../store/slices/product-slice";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const {
    orders,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orders);

  // Efect hook for fetch orders
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Handler for cancel order
  const handleCancelOrder = (oid) => {
    dispatch(cancelOrder(oid))
      .unwrap()
      .then(() => {
        toast.success("Order cancelled successfully.");
      })
      .catch(() => {
        toast.error("Failed to cancel order.");
      });
  };

  // Handler for reorder
  const handleReorder = (productSlug, productQuantity) => {
    // fetch product details to check product stock for product availability.
    dispatch(fetchProductDetails(productSlug)) 
      .unwrap()
      .then((product) => {
        if (
          !product.variants ||
          product.variants.length === 0 ||
          product.variants[0].stock <= 0
        ) {
          toast.warning("Out of Stock!");
          return;
        }
        if (product.variants[0].stock < productQuantity) {
          toast.warning(`${product.variants[0].stock} items left!`);
          return;
        }
        // dispatch addToCart request for add product to cart.
        dispatch(
          addToCart({
            variantId: product.variants[0]._id,
            quantity: productQuantity,
          })
        )
          .unwrap()
          .then(() => {
            // dispatch fetchCart request for imediatly update cart!
            dispatch(fetchCart());
            toast.success("Product Added to cart.");
          })
          .catch(() => {
            toast.error("Failed to add to cart.");
          });
      })
      .catch(() => {
        toast.error("Failed to check stock!");
      });
  };

  // function for change distinct colors for diffrent order status
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "border-amber-500 bg-amber-50 text-amber-600",
      cancelled: "border-red-500 bg-red-100 text-red-600",
      shipped: "border-blue-500 bg-blue-100 text-blue-600",
      delivered: "border-green-500 bg-green-100 text-green-600",
      processing: "border-purple-500 bg-purple-100 text-purple-600",
    };

    return (
      <div
        className={`border-1 px-2 py-1 rounded font-normal ${
          statusStyles[status] || "border-gray-500 bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </div>
    );
  };

  return (
    <Fragment>
      <LayoutOne>
        <div className="min-h-full bg-gray-100 flex items-center justify-center p-6">
          <div className="w-full lg:w-3/4 xl:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Order History
            </h2>
            {orderStatus === "fetch-loading" && <p>Loading orders...</p>}
            {orderStatus === "fetch-failed" && (
              <p className="text-red-500">{orderError}</p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-3 text-left">Index</th>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Total price</th>
                    <th className="p-3 text-left">Order Status</th>
                    <th className="p-3 text-left">Loyalty Points</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order, orderIndex) => (
                      <>
                        <tr key={order._id} className="bg-gray-200 font-medium">
                          <td className="p-3" colSpan="6">
                            Order #{orderIndex + 1} -{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-left" colSpan="2">
                            Order ID: {order._id}
                          </td>
                        </tr>
                        {order.items.map((item, index) => (
                          <tr
                            key={`${order._id}-${index}`}
                            className="border-b hover:bg-purple-100 transition"
                          >
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.variant.product.name}</td>
                            <td className="p-3">{item.quantity}</td>
                            <td className="p-3">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 font-semibold">
                              {item.subTotal} MVR
                            </td>
                            <td className="p-3">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="p-3">{item.points}</td>
                            <td className="p-3 flex items-center gap-2">
                              <button
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                onClick={() =>
                                  handleReorder(
                                    item.variant.product.slug,
                                    item.quantity
                                  )
                                }
                              >
                                Reorder
                              </button>
                              {order.status === "pending" && (
                                <button
                                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                  onClick={() => handleCancelOrder(order._id)}
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutOne>
      <ToastContainer />
    </Fragment>
  );
};

export default OrderHistory;
