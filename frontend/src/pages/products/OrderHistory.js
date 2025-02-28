import React, { Fragment, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutOne from "../../layouts/LayoutOne";
import { cancelOrder, fetchOrders } from "../../store/slices/order-slice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../../store/slices/cart-slice";
import { fetchProductDetails } from "../../store/slices/product-slice";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import emptyOrdersImg from "../../assets/images/emptyOrders.svg";
import dropArrowIcon from "../../assets/icons/dropArrow.svg";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orders);

  const [filters, setFilters] = useState({
    status: undefined,
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Efect hook for fetch orders
  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  // Handler for cancel order
  const handleCancelOrder = (oid) => {
    dispatch(cancelOrder(oid))
      .unwrap()
      .then(() => {
        toast.success("Order cancelled successfully.");
        // Use current filters (which include the current page) when refetching orders
        dispatch(fetchOrders(filters))
          .unwrap()
          .then(() => {
            console.log("🔰 Orders are re-fetched!");
          });
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
          toast.warning(`Only ${product.variants[0].stock} items left!`);
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

  // handler for filterChange
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value || undefined, // undefine use when value is empty, then mark as undefine
      page: 1,
    });
  };

  // handler for pagination
  const handlePagination = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: direction === "next" ? prev.page + 1 : Math.max(prev.page - 1, 1),
    }));
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>

            <div className="flex gap-4 mb-4">
              <div className="relative">
                <select
                  name="status"
                  value={filters.status || ""}
                  onChange={handleFilterChange}
                  className="p-2 border rounded w-[150px] appearance-none pr-8"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img
                    src={dropArrowIcon}
                    alt="dropdown arrow"
                    className="w-4"
                  />
                </div>
              </div>

              <div className="relative">
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleFilterChange}
                  className="p-2 border rounded w-[150px] appearance-none pr-8"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img
                    src={dropArrowIcon}
                    alt="dropdown arrow"
                    className="w-4"
                  />
                </div>
              </div>
            </div>

            {orderStatus === "fetch-loading" ? (
              // Show Loading State with Centered HashLoader
              <div className="flex flex-col justify-center items-center py-[50px] mx-auto text-gray-700 font-semibold">
                <HashLoader color="#a855f7" size={50} />
                <span className="mt-3">Loading Orders...</span>
              </div>
            ) : orderStatus === "fetch-failed" ? (
              // Show Error Message Instead of Table
              <div className="my-[50px] text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
                <span className="mt-3">{orderError}</span>
              </div>
            ) : orders.length === 0 ? (
              // Show no orders available
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src={emptyOrdersImg}
                  alt="empty order image"
                  className="w-[100px]"
                />
                <p className="text-center text-gray-700 font-semibold py-6">
                  No{" "}
                  <span className="text-purple-600">
                    {filters.status ? filters.status + " " : ""}
                  </span>
                  orders found.
                </p>
                <button
                  className="px-6 py-2 border-1 border-purple-500 bg-purple-100 font-medium text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
                  onClick={() => navigate("/product-catalogue")}
                >
                  Shop Now
                </button>
              </div>
            ) : (
              // Show Table Only If There’s No Loading/Error -----------------------------------------------------------------
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
                          <tr
                            key={order._id}
                            className="bg-gray-200 font-medium"
                          >
                            <td className="p-3" colSpan="6">
                              Order ID: {order._id} -{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-green-600" colSpan="1">
                              +{order.earnedPoints}
                            </td>
                            <td className="p-3 text-left" colSpan="1">
                              {order.status === "pending" ? (
                                <>
                                  {orderStatus === "cancelOrder-loading" ? (
                                    <>
                                      <HashLoader color="#a855f7" size={20} />
                                      <p>Canceling Order...</p>
                                    </>
                                  ) : (
                                    <button
                                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                      onClick={() =>
                                        handleCancelOrder(order._id)
                                      }
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </>
                              ) : null}
                            </td>
                          </tr>
                          {order.items.map((item, index) => (
                            <tr
                              key={`${order._id}-${index}`}
                              className="border-b hover:bg-purple-100 transition"
                            >
                              <td className="p-3">{index + 1}</td>
                              <td className="p-3">
                                {item.variant.product.name}
                              </td>
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
                              <td className="p-3">{}</td>
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
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                  </tbody>
                </table>

                {/* ------------Pagination--------------- */}
                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                    disabled={filters.page === 1}
                    onClick={() => handlePagination("prev")}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">Page {filters.page}</span>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                    disabled={orders.length < 10}
                    onClick={() => handlePagination("next")}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
      <ToastContainer />
    </Fragment>
  );
};

export default OrderHistory;
