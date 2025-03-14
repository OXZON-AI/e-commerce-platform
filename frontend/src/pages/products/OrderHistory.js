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
import PuffLoader from "react-spinners/PuffLoader";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders,
    paginationInfo,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orders);
  const { status: cartStatus } = useSelector((state) => state.cart);

  const [filters, setFilters] = useState({
    status: undefined,
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  const [loadingOrders, setLoadingOrders] = useState({
    cancel: {},
    reorder: {},
  });

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    console.log("Updated Orders:", orders);
  }, [orders]);

  const handleCancelOrder = (oid) => {
    setLoadingOrders((prev) => ({
      ...prev,
      cancel: { ...prev.cancel, [oid]: true },
    }));
    dispatch(cancelOrder(oid))
      .unwrap()
      .then(() => {
        toast.success("Order cancelled successfully.");
        dispatch(fetchOrders(filters));
      })
      .catch(() => {
        toast.error("Failed to cancel order.");
      })
      .finally(() => {
        setLoadingOrders((prev) => ({
          ...prev,
          cancel: { ...prev.cancel, [oid]: false },
        }));
      });
  };

  const handleReorder = (productSlug, productQuantity, orderId) => {
    setLoadingOrders((prev) => ({
      ...prev,
      reorder: { ...prev.reorder, [orderId]: true },
    }));
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
      })
      .finally(() => {
        setLoadingOrders((prev) => ({
          ...prev,
          reorder: { ...prev.reorder, [orderId]: false },
        }));
      });
  };

  // handler for filterChange
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value || undefined,
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
          <div className="w-full lg:w-3/4 xl:w- bg-white p-6 rounded-lg shadow-md">
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
                <table className="min-w-full border-collapse rounded-lg">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="p-3 text-left">Index</th>
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Total Price</th>
                      <th className="p-3 text-left">Order Status</th>
                      <th className="p-3 text-left">Loyalty Points</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map((order, orderIndex) => (
                        <Fragment key={order._id}>
                          <tr className="bg-gray-200 font-medium">
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
                                  {loadingOrders.cancel[order._id] ? (
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
                                {item.variant?.image?.url && (
                                  <img
                                    src={item.variant.image.url}
                                    alt={item.variant.product.name}
                                    className="w-12 h-12 object-cover"
                                  />
                                )}
                              </td>
                              <td className="p-3">
                                {item.variant?.product?.name}
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
                                {loadingOrders.reorder[order._id] ? (
                                  <button
                                    className="px-4 py-2 bg-purple-300 text-white rounded"
                                    disabled={true}
                                  >
                                    <PuffLoader color="#7e22ce" size={20} />
                                  </button>
                                ) : (
                                  <button
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                    disabled={
                                      cartStatus === "loading-add-to-cart"
                                    }
                                    onClick={() =>
                                      handleReorder(
                                        item.variant?.product?.slug,
                                        item.quantity,
                                        order._id
                                      )
                                    }
                                  >
                                    Reorder
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
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
                  <span className="px-4 py-2">
                    Page {filters.page} of {paginationInfo.totalPages}
                  </span>
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
      <ToastContainer autoClose={3000} position="bottom-right" />
    </Fragment>
  );
};

export default OrderHistory;
