import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  fetchOrders,
} from "../../../../store/slices/order-slice";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";
import { FadeLoader, HashLoader, MoonLoader } from "react-spinners";

const OrdersToExcel = () => {
  const dispatch = useDispatch();
  const { allOrdersPaginationInfo } = useSelector((state) => state.orders);

  const [processing, setProcessing] = useState(false);

  // handler for export Excel sheet of orders
  const handleExport = async () => {
    setProcessing(true); // set processing state as true
    let allOrders = [];

    try {
      // Fetch total pages for non-guest orders
      const responseNonGuest = await dispatch(
        fetchAllOrders({ guestOnly: false, page: 1, limit: 10 })
      ).unwrap();
      const totalNonGuestPages = responseNonGuest.paginationInfo.totalPages;

      // Fetch total pages for guest orders
      const responseGuest = await dispatch(
        fetchAllOrders({ guestOnly: true, page: 1, limit: 10 })
      ).unwrap();
      const totalGuestPages = responseGuest.paginationInfo.totalPages;

      // Fetch all non-guest orders from all pages
      for (let page = 1; page <= totalNonGuestPages; page++) {
        const response = await dispatch(
          fetchAllOrders({ guestOnly: false, page, limit: 10 })
        ).unwrap();
        allOrders = [...allOrders, ...response.orders];
      }

      // Fetch all guest orders from all pages
      for (let page = 1; page <= totalGuestPages; page++) {
        const response = await dispatch(
          fetchAllOrders({ guestOnly: true, page, limit: 10 })
        ).unwrap();
        allOrders = [...allOrders, ...response.orders];
      }

      console.log("all-orders :::: ", allOrders);

      if (allOrders.length === 0) {
        toast.info("No orders available to export.");
        return;
      }

      // Format data for excel export
      const dataToExport = allOrders.flatMap((order) => {
        const orderData = {
          "Order ID": order?._id,
          "Customer Name": order.user?.name || "Guest",
          Email: order?.email,
          "Total Amount (MVR)": order?.payment?.amount,
          "Order Status": order?.status,
          "Created At": new Date(order?.createdAt).toLocaleString(),
        };

        return order.items.map((item) => ({
          ...orderData,
          "Item Name": item?.variant?.product?.name,
          Quantity: item?.quantity,
          "Unit Price (MVR)": item?.subTotal / item?.quantity,
          "Total (MVR)": item?.subTotal,
        }));
      });

      // Create a new worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // Convert workbook to Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Save file using FileSaver
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);

      setProcessing(false); // reset the processing state to false
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch all orders for export.");
    }
  };

  return (
    // Export Button
    <button
      onClick={handleExport}
      disabled={processing}
      className={`flex items-center justify-center w-36 px-2 py-3 text-white bg-green-600 rounded-lg  ${
        processing ? "bg-opacity-50 cusor-not-allowed" : "hover:bg-green-700 transition"
      }`}
    >
      {processing ? (
        <MoonLoader size={18} color="white" className="mr-2" />
      ) : (
        <FaDownload className="mr-2" />
      )}
      <span>Export</span>
    </button>
  );
};

export default OrdersToExcel;
