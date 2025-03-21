// import React, { Fragment, useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import LayoutOne from "../../layouts/LayoutOne";
// import { cancelOrder, fetchOrders } from "../../store/slices/order-slice";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart, fetchCart } from "../../store/slices/cart-slice";
// import { fetchProductDetails } from "../../store/slices/product-slice";
// import HashLoader from "react-spinners/HashLoader";
// import { useNavigate } from "react-router-dom";
// import emptyOrdersImg from "../../assets/images/emptyOrders.svg";
// import dropArrowIcon from "../../assets/icons/dropArrow.svg";
// import PuffLoader from "react-spinners/PuffLoader";

// const OrderHistory = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {
//     orders,
//     paginationInfo,
//     status: orderStatus,
//     error: orderError,
//   } = useSelector((state) => state.orders);
//   const { status: cartStatus } = useSelector((state) => state.cart);

//   const [filters, setFilters] = useState({
//     status: undefined,
//     sortBy: "date",
//     sortOrder: "desc",
//     page: 1,
//     limit: 10,
//   });

//   // Efect hook for fetch orders
//   useEffect(() => {
//     dispatch(fetchOrders(filters));
//   }, [dispatch, filters]);

//   // Handler for cancel order
//   const handleCancelOrder = (oid) => {
//     dispatch(cancelOrder(oid))
//       .unwrap()
//       .then(() => {
//         toast.success("Order cancelled successfully.");
//         // Use current filters (which include the current page) when refetching orders
//         dispatch(fetchOrders(filters))
//           .unwrap()
//           .then(() => {
//             console.log("🔰 Orders are re-fetched!");
//           });
//       })
//       .catch(() => {
//         toast.error("Failed to cancel order.");
//       });
//   };

//   // Handler for reorder
//   const handleReorder = (productSlug, productQuantity) => {
//     if (!productSlug || !productQuantity) {
//       toast.info("Product Not Available");
//       console.error(
//         `Product Slug or Product Quantity error : product slug : ${productSlug} producct quantity : ${productQuantity}`
//       );
//       return;
//     }

//     // fetch product details to check product stock for product availability.
//     dispatch(fetchProductDetails(productSlug))
//       .unwrap()
//       .then((product) => {
//         if (
//           !product.variants ||
//           product.variants.length === 0 ||
//           product.variants[0].stock <= 0
//         ) {
//           toast.warning("Out of Stock!");
//           return;
//         }
//         if (product.variants[0].stock < productQuantity) {
//           toast.warning(`Only ${product.variants[0].stock} items left!`);
//           return;
//         }
//         // dispatch addToCart request for add product to cart.
//         dispatch(
//           addToCart({
//             variantId: product.variants[0]._id,
//             quantity: productQuantity,
//           })
//         )
//           .unwrap()
//           .then(() => {
//             // dispatch fetchCart request for imediatly update cart!
//             dispatch(fetchCart());
//             toast.success("Product Added to cart.");
//           })
//           .catch(() => {
//             toast.error("Failed to add to cart.");
//           });
//       })
//       .catch(() => {
//         toast.error("Failed to check stock!");
//       });
//   };

//   // handler for filterChange
//   const handleFilterChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value || undefined, // undefine use when value is empty, then mark as undefine
//       page: 1,
//     });
//   };

//   // handler for pagination
//   const handlePagination = (direction) => {
//     setFilters((prev) => ({
//       ...prev,
//       page: direction === "next" ? prev.page + 1 : Math.max(prev.page - 1, 1),
//     }));
//   };

//   // function for change distinct colors for diffrent order status
//   const getStatusBadge = (status) => {
//     const statusStyles = {
//       pending: "border-amber-500 bg-amber-50 text-amber-600",
//       cancelled: "border-red-500 bg-red-100 text-red-600",
//       shipped: "border-blue-500 bg-blue-100 text-blue-600",
//       delivered: "border-green-500 bg-green-100 text-green-600",
//       processing: "border-purple-500 bg-purple-100 text-purple-600",
//     };

//     return (
//       <div
//         className={`border-1 px-2 py-1 rounded font-normal ${
//           statusStyles[status] || "border-gray-500 bg-gray-100 text-gray-600"
//         }`}
//       >
//         {status}
//       </div>
//     );
//   };

//   return (
//     <Fragment>
//       <LayoutOne>
//         <div className="min-h-full bg-gray-100 flex items-center justify-center p-6">
//           <div className="w-full lg:w-3/4 xl:w-2/3 bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>

//             <div className="flex gap-4 mb-4">
//               <div className="relative">
//                 <select
//                   name="status"
//                   value={filters.status || ""}
//                   onChange={handleFilterChange}
//                   className="p-2 border rounded w-[150px] appearance-none pr-8"
//                 >
//                   <option value="">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//                   <img
//                     src={dropArrowIcon}
//                     alt="dropdown arrow"
//                     className="w-4"
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <select
//                   name="sortOrder"
//                   value={filters.sortOrder}
//                   onChange={handleFilterChange}
//                   className="p-2 border rounded w-[150px] appearance-none pr-8"
//                 >
//                   <option value="desc">Newest First</option>
//                   <option value="asc">Oldest First</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//                   <img
//                     src={dropArrowIcon}
//                     alt="dropdown arrow"
//                     className="w-4"
//                   />
//                 </div>
//               </div>
//             </div>

//             {orderStatus === "fetch-loading" ? (
//               // Show Loading State with Centered HashLoader
//               <div className="flex flex-col justify-center items-center py-[50px] mx-auto text-gray-700 font-semibold">
//                 <HashLoader color="#a855f7" size={50} />
//                 <span className="mt-3">Loading Orders...</span>
//               </div>
//             ) : orderStatus === "fetch-failed" ? (
//               // Show Error Message Instead of Table
//               <div className="my-[50px] text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
//                 <span className="mt-3">{orderError}</span>
//               </div>
//             ) : orders.length === 0 ? (
//               // Show no orders available
//               <div className="flex flex-col items-center text-center py-6">
//                 <img
//                   src={emptyOrdersImg}
//                   alt="empty order image"
//                   className="w-[100px]"
//                 />
//                 <p className="text-center text-gray-700 font-semibold py-6">
//                   No{" "}
//                   <span className="text-purple-600">
//                     {filters.status ? filters.status + " " : ""}
//                   </span>
//                   orders found.
//                 </p>
//                 <button
//                   className="px-6 py-2 border-1 border-purple-500 bg-purple-100 font-medium text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
//                   onClick={() => navigate("/product-catalogue")}
//                 >
//                   Shop Now
//                 </button>
//               </div>
//             ) : (
//               // Show Table Only If There’s No Loading/Error -----------------------------------------------------------------
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse rounded-lg overflow-hidden">
//                   <thead>
//                     <tr className="bg-gray-700 text-white">
//                       <th className="p-3 text-left">Index</th>
//                       <th className="p-3 text-left">Item</th>
//                       <th className="p-3 text-left">Quantity</th>
//                       <th className="p-3 text-left">Date</th>
//                       <th className="p-3 text-left">Total price</th>
//                       <th className="p-3 text-left">Order Status</th>
//                       <th className="p-3 text-left">Loyalty Points</th>
//                       <th className="p-3 text-left">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders &&
//                       orders.map((order, orderIndex) => (
//                         <>
//                           <tr
//                             key={order._id}
//                             className="bg-gray-200 font-medium"
//                           >
//                             <td className="p-3" colSpan="6">
//                               Order ID: {order._id} -{" "}
//                               {new Date(order.createdAt).toLocaleDateString()}
//                             </td>
//                             <td className="p-3 text-green-600" colSpan="1">
//                               +{order.earnedPoints}
//                             </td>
//                             <td className="p-3 text-left" colSpan="1">
//                               {order.status === "pending" ? (
//                                 <>
//                                   {orderStatus === "cancelOrder-loading" ? (
//                                     <>
//                                       <HashLoader color="#a855f7" size={20} />
//                                       <p>Canceling Order...</p>
//                                     </>
//                                   ) : (
//                                     <button
//                                       className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
//                                       onClick={() =>
//                                         handleCancelOrder(order._id)
//                                       }
//                                     >
//                                       Cancel
//                                     </button>
//                                   )}
//                                 </>
//                               ) : null}
//                             </td>
//                           </tr>
//                           {order.items.map((item, index) => (
//                             <tr
//                               key={`${order._id}-${index}`}
//                               className="border-b hover:bg-purple-100 transition"
//                             >
//                               <td className="p-3">{index + 1}</td>
//                               <td className="p-3">
//                                 {item.variant?.product?.name}
//                               </td>
//                               <td className="p-3">{item.quantity}</td>
//                               <td className="p-3">
//                                 {new Date(order.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="p-3 font-semibold">
//                                 {item.subTotal} MVR
//                               </td>
//                               <td className="p-3">
//                                 {getStatusBadge(order.status)}
//                               </td>
//                               <td className="p-3">{}</td>
//                               <td className="p-3 flex items-center gap-2">
//                                 {cartStatus === "loading-add-to-cart" ? (
//                                   <button
//                                     className="px-4 py-2 bg-purple-300 text-white rounded"
//                                     disabled={true}
//                                   >
//                                     <PuffLoader color="#7e22ce" size={20} />
//                                   </button>
//                                 ) : (
//                                   <button
//                                     className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
//                                     disabled={
//                                       cartStatus === "loading-add-to-cart"
//                                     }
//                                     onClick={() =>
//                                       handleReorder(
//                                         item.variant?.product?.slug,
//                                         item.quantity
//                                       )
//                                     }
//                                   >
//                                     Reorder
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </>
//                       ))}
//                   </tbody>
//                 </table>

//                 {/* ------------Pagination--------------- */}
//                 <div className="flex justify-between mt-4">
//                   <button
//                     className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
//                     disabled={filters.page === 1}
//                     onClick={() => handlePagination("prev")}
//                   >
//                     Previous
//                   </button>
//                   <span className="px-4 py-2">
//                     Page {filters.page} of {paginationInfo.totalPages}
//                   </span>
//                   <button
//                     className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
//                     disabled={orders.length < 10}
//                     onClick={() => handlePagination("next")}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </LayoutOne>
//       <ToastContainer autoClose={3000} position="bottom-right" />
//     </Fragment>
//   );
// };

// export default OrderHistory;

import React, { Fragment, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutOne from "../../layouts/LayoutOne";
import { cancelOrder, fetchOrders } from "../../store/slices/order-slice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../../store/slices/cart-slice";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import emptyOrdersImg from "../../assets/images/emptyOrders.svg";
import { MoonLoader } from "react-spinners";
import {
  Hourglass,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders,
    paginationInfo,
    status: orderStatus,
  } = useSelector((state) => state.orders);
  // const { status: cartStatus } = useSelector((state) => state.cart);

  const [isReOrdering, setIsReOrdering] = useState(false);
  const [reorderingOrderId, setReorderingOrderId] = useState(null);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [filters, setFilters] = useState({
    status: undefined,
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 6,
  });

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  // handler for filters
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value === "" ? undefined : e.target.value,
      page: 1,
    });
  };

  // handler for cancel order
  const handleCancelOrder = (oid) => {
    setCancelingOrderId(oid);

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
        setCancelingOrderId(null);
      });
  };

  // handler for reorder
  const handleReorderAll = async (orderId, items) => {
    setIsReOrdering(true);
    setReorderingOrderId(orderId);
    for (const item of items) {
      try {
        await dispatch(
          addToCart({ variantId: item.variant?._id, quantity: item.quantity })
        ).unwrap();
      } catch (error) {
        console.error("Failed to add item to cart", error);
        toast.error("Some items couldn't be added. Please try again.");
        return;
      }
    }
    dispatch(fetchCart());

    toast.success("All items added to cart.");
    setIsReOrdering(false);
    setReorderingOrderId(null);
  };

  // handler for pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
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
      <span
        className={`px-2 py-1 text-xs font-semibold border-1 rounded 
                      ${statusStyles[status]}`}
      >
        {status}
      </span>
      // <div
      //   className={`border-1 px-2 py-1 rounded font-normal ${
      //     statusStyles[status] || "border-gray-500 bg-gray-100 text-gray-600"
      //   }`}
      // >
      //   {status}
      // </div>
    );
  };

  return (
    <Fragment>
      <LayoutOne>
        <div className="min-h-full bg-gray-100 flex flex-col items-center p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>
          <p className="text-gray-700 mb-4">You have made <span className="text-purple-600 font-semibold">{paginationInfo.totalCount} </span> orders so far.</p>

          <div className="flex gap-4 mb-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-2 bg-white border rounded"
            >
              <option value="">All Status</option>
              <option value="pending">
                {" "}
                <Hourglass className="inline w-4 h-4 mr-1" /> Pending
              </option>
              <option value="processing">
                {" "}
                <RefreshCcw className="inline w-4 h-4 mr-1" /> Processing
              </option>
              <option value="shipped">
                {" "}
                <Truck className="inline w-4 h-4 mr-1" /> Shipped
              </option>
              <option value="delivered">
                {" "}
                <CheckCircle className="inline w-4 h-4 mr-1" /> Delivered
              </option>
              <option value="cancelled">
                {" "}
                <XCircle className="inline w-4 h-4 mr-1" /> Cancelled
              </option>
            </select>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="p-2 bg-white border rounded"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {orderStatus === "fetch-loading" ? (
            <div className="flex flex-col justify-center items-center py-10 text-gray-700 font-semibold">
              <HashLoader color="#a855f7" size={50} />
              <span className="mt-3">Loading Orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center text-center py-6">
              <img src={emptyOrdersImg} alt="empty order" className="w-40" />
              <p className="text-gray-700 font-semibold py-4">
                No orders found.
              </p>
              <button
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={() => navigate("/product-catalogue")}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              {/* Use items-stretch so all cards match the height of the tallest card */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col"
                  >
                    <h3 className="text-xs font-semibold text-gray-500">
                      Order ID: {order._id}
                    </h3>

                    {/* STATUS + DATE */}
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(order.status)}
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* 
                    Product list grows to fill the space:
                    - flex-1 to take up available vertical space
                    - max-h so it scrolls if > 3 items
                  */}
                    <div className="flex-1 mt-2 space-y-4 pr-2 overflow-y-auto max-h-[300px]">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="border-b pb-4 flex items-center gap-4"
                        >
                          <img
                            src={item.variant?.image?.url}
                            alt={item.variant?.image?.alt}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium truncate w-40">
                              {item.variant?.product?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-semibold">{item.subTotal} MVR</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 
                    Footer (totals + buttons) pinned at the bottom:
                    - mt-auto pushes this section to the bottom
                  */}
                    <div className="mt-auto">
                      <div className="space-y-1">
                        <p className="font-semibold text-md">
                          Gross: {order.payment.amount.toFixed(2)} MVR
                        </p>
                        <p className="text-green-600 font-semibold text-md">
                          Discount: {order.payment.discount.toFixed(2)} MVR
                        </p>
                        <p className="font-semibold text-md">
                          Net:{" "}
                          {(
                            order.payment.amount - order.payment.discount
                          ).toFixed(2)}{" "}
                          MVR
                        </p>
                      </div>

                      <div className="flex justify-between mt-4">
                        {order.status === "pending" ? (
                          <button
                            disabled={cancelingOrderId === order._id}
                            onClick={() => handleCancelOrder(order._id)}
                            className={`flex items-center justify-center px-4 py-2 text-sm bg-gray-500 text-white rounded-lg ${
                              cancelingOrderId
                                ? "bg-opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {cancelingOrderId === order._id ? (
                              <MoonLoader
                                size={18}
                                color="white"
                                className="mr-2"
                              />
                            ) : null}
                            Cancel
                          </button>
                        ) : null}

                        <button
                          onClick={() =>
                            handleReorderAll(order._id, order.items)
                          }
                          disabled={reorderingOrderId === order._id}
                          className={`flex items-center justify-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg ${
                            isReOrdering
                              ? "bg-opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {reorderingOrderId === order._id ? (
                            <MoonLoader
                              size={18}
                              color="white"
                              className="mr-2"
                            />
                          ) : null}
                          Reorder All
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* pagination  */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {filters.page} of {paginationInfo.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === paginationInfo.totalPages}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </LayoutOne>
      <ToastContainer autoClose={3000} position="bottom-right" />
    </Fragment>
  );
};

export default OrderHistory;
