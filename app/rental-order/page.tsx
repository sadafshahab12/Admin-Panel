"use client";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import Swal from "sweetalert2";

interface RentalCustomer {
  _id: string;
  _type: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  _createdAt: string;
}

interface RentalProductImage {
  _type: string;
  asset: {
    _id: string;
    url: string;
  };
}

interface RentalOrder {
  _id: string;
  rentalStartDate: string;
  rentalEndDate: string;
  productImage: RentalProductImage;
  quantity: number;
  totalPrice: number;
  rentalPricePerDay: number;
  totalDays: number;
  customerId: RentalCustomer;
  status: string;
  _createdAt: string;
  _updatedAt: string;
  product: string;
}

const RentalOrderPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rentalOrders, setRentalOrders] = useState<RentalOrder[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    client
      .fetch(
        groq`*[_type == "rentalOrder"] {
          _id,
          rentalStartDate,
          rentalEndDate,
          productImage {
            _type,
            asset->{
              _id,
              url
            }
          },
          quantity,
          totalPrice,
          rentalPricePerDay,
          totalDays,
          customerId->{
            _id,
            fullName,
            email,
            phone,
            address
          },
          product,
          status,
          _createdAt,
          _updatedAt
        }`
      )
      .then((data) => setRentalOrders(data))
      .catch((err) => console.error("Error in fetching orders", err));
  }, []);

  const statusList = [
    { title: "All", value: "All" },
    { title: "Pending", value: "Pending" },
    { title: "Confirmed", value: "Confirmed" },
    { title: "Processing", value: "Processing" },
    { title: "Shipped", value: "Shipped" },
    { title: "Delivered", value: "Delivered" },
    { title: "Active", value: "Active" },
    { title: "Completed", value: "Completed" },
    { title: "Returned", value: "Returned" },
    { title: "Cancelled", value: "Cancelled" },
    { title: "Delayed", value: "Delayed" },
    { title: "Overdue", value: "Overdue" },
    { title: "Expired", value: "Expired" },
  ];

  const filterOrders =
    filter === "All"
      ? rentalOrders
      : rentalOrders.filter(
          (order) => order.status.toLowerCase() === filter.toLowerCase()
        );

  const searchOrder = () => {
    return filterOrders.filter((order) => {
      const { fullName, email, phone } = order.customerId || {}; // Add default empty object to avoid undefined
      const query = searchQuery.toLowerCase();
      return (
        (fullName && fullName.toLowerCase().includes(query)) ||
        (email && email.toLowerCase().includes(query)) ||
        (phone && phone.toLowerCase().includes(query))
      );
    });
  };

  const handleDeleteOrder = async (orderId: string, customerId?: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      // 🛒 Delete order first
      await client.delete(orderId);
      console.log("Order deleted:", orderId);

      // 👤 Delete customer if they exist
      if (customerId) {
        await client.delete(customerId);
        console.log("Customer deleted:", customerId);
      }

      // 🔄 Update UI: Remove the deleted order from state
      setRentalOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      // ✅ Success Alert
      Swal.fire({
        title: "Deleted!",
        text: "The order and customer have been deleted.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting order and customer:", error);

      // ❌ Error Alert
      Swal.fire({
        title: "Error!",
        text: "Failed to delete order.",
        icon: "error",
      });
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: RentalOrder["status"]
  ) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setRentalOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Success message based on the new status
      let successMessage = "";
      switch (newStatus) {
        case "shipped":
          successMessage = "Order has been shipped.";
          break;
        case "completed":
          successMessage = "Order has been completed.";
          break;
        case "returned":
          successMessage = "Order has been returned.";
          break;
        case "delayed":
          successMessage = "Order has been delayed.";
          break;
        case "overdue":
          successMessage = "Order is overdue.";
          break;
        case "expired":
          successMessage = "Order has expired.";
          break;
        case "pending":
          successMessage = "Order is now pending.";
          break;
        case "confirmed":
          successMessage = "Order has been confirmed.";
          break;
        case "processing":
          successMessage = "Order is being processed.";
          break;
        case "active":
          successMessage = "Order is now active.";
          break;
        case "cancelled":
          successMessage = "Order has been cancelled.";
          break;
        default:
          successMessage = "Status updated.";
          break;
      }

      Swal.fire("Status Updated", successMessage, "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error!", "Failed to change status", "error");
    }
  };

  const totalRevenue = rentalOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );
  const totalOrders = rentalOrders.length;
  const totalCustomers = new Set(rentalOrders.map((order) => order.customerId))
    .size;
  const pendingDeliveries = rentalOrders.filter(
    (order) => order.status === "pending"
  ).length;

  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <nav className="flex justify-between items-center bg-slate-800 p-5">
        <div className="text-white">
          <RiDashboardFill className="w-8 h-8" />
          <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 p-5">
          <div className="bg-white shadow-md p-4 text-center rounded-md">
            <h2 className="text-lg font-bold">Total Revenue</h2>
            <p className="text-lg text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow-md p-4 text-center rounded-md">
            <h2 className="text-lg font-bold">Total Orders</h2>
            <p className="text-lg">{totalOrders}</p>
          </div>
          <div className="bg-white shadow-md p-4 text-center rounded-md">
            <h2 className="text-lg font-bold">Total Customers</h2>
            <p className="text-lg">{totalCustomers}</p>
          </div>
          <div className="bg-white shadow-md p-4 text-center rounded-md">
            <h2 className="text-lg font-bold">Pending Deliveries</h2>
            <p className="text-lg text-red-600">{pendingDeliveries}</p>
          </div>
        </div>
        <Link href="/">
          <button className="text-slate-800 flex items-center gap-2 bg-white py-2 px-3 rounded-md text-sm">
            Signout <PiSignOut className="w-5 h-5" />
          </button>
        </Link>
      </nav>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <Link href="/admin/dashboard">
          <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-400 cursor-pointer">
            <TiArrowBack className="w-6 h-6" />
          </div>
        </Link>

        <h2 className="text-2xl font-bold text-center">Rental Orders</h2>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Customer"
            className="w-full py-2 px-4 bg-transparent border  border-slate-500 rounded-md outline-none focus:shadow-md "
          />
        </div>

        {/* Status dropdown */}
        <div className="flex items-center gap-4">
          <label htmlFor="status" className="text-slate-800">
            Filter by Status:
          </label>
          <select
            id="status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white text-slate-800 px-4 py-2 rounded-md"
          >
            {statusList.map(({ title, value }) => (
              <option key={value} value={value}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-y-auto bg-white rounded-md shadow-md">
          <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead className="text-left">
              <tr className="bg-gray-800 text-white text-sm">
                <th className="p-4 border">Order ID</th>
                <th className="p-4 border">Customer Name</th>
                <th className="p-4 border">Address</th>
                <th className="p-4 border">Order Date</th>
                <th className="p-4 border">Quantity</th>
                <th className="p-4 border">Total Amount</th>
                <th className="p-4 border">Status</th>
                <th className="p-4 border">Actions</th>
              </tr>
            </thead>
            <tbody className=" text-sm">
              {searchOrder().map((order) => (
                <tr key={order._id} className="border-b ">
                  <td className="p-4">{order._id}</td>
                  <td className="p-4">{order.customerId.fullName}</td>
                  <td className="p-4">{order.customerId.address}</td>
                  <td className="p-4">{order._createdAt.split("T")[0]}</td>
                  <td className="p-4">{order.quantity}</td>
                  <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="px-4 py-1 rounded-md bg-gray-200"
                    >
                      {statusList.map(({ title, value }) => (
                        <option key={value} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      className="text-red-600"
                      onClick={() =>
                        handleDeleteOrder(order._id, order.customerId?._id)
                      }
                    >
                      <IoMdTrash className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalOrderPage;
