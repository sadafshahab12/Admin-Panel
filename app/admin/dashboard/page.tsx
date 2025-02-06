"use client";


import { client } from "@/sanity/lib/client";
import { SignedIn, SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { groq } from "next-sanity";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSquareCheck } from "react-icons/fa6";
import { IoMdTrash } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";
import Swal from "sweetalert2";

export type CartItem = {
  _id: string;
  title: string;
  price: number;
  image: string;
};

export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
};

export type Order = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  status: "pending" | "completed" | "shipped" | "cancelled";
  totalPrice: number;
  userId: string;
  cartItems: CartItem[];
  customer: Customer;
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectOrderId, setSelectOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    client
      .fetch(
        groq`*[_type == "order"] {
          _id,
          _createdAt,
          _updatedAt,
          status,
          totalPrice,
          userId,
          cartItems[] {
            _id,
            title,
            price,
            image
          },
          customer-> {
            _id,
            firstName,
            lastName,
            email,
            phone,
            streetAddress
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error in fetching orders", err));
  }, []);

  const filterOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === filter.toLowerCase()
        );

  const searchOrder = () => {
    return filterOrders.filter((order) => {
      const { firstName, lastName, email, phone } = order.customer;
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  };

  const toggleOrderDetails = (orderId: string) => {
    setSelectOrderId((prev) => (prev === orderId ? null : orderId));
    console.log(selectOrderId);
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
      setOrders((prevOrders) =>
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
    newStatus: Order["status"]
  ) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "shipped") {
        Swal.fire("Order Shipped", "Order has been shipped", "success");
      } else if (newStatus === "completed") {
        Swal.fire("Success", "Order has been completed", "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error!", "Failed to change status", "error");
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((order) => order.customer._id))
    .size;
  const pendingDeliveries = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  useEffect(() => {
    if (isSignedIn && user) {
      setIsUserLoaded(true);
      if (
        user &&
        user.primaryEmailAddress?.emailAddress !==
          process.env.NEXT_PUBLIC_ADMIN_EMAIL
      ) {
        router.replace("/");
      }
    }
  }, [isSignedIn, user, router]);

  if (!isUserLoaded) {
    return <div>Loading....</div>;
  }
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
              <p className="text-lg text-green-600">
                ${totalRevenue.toFixed(2)}
              </p>
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
          <div>
            <SignedIn>
              <SignOutButton>
                <button className="text-slate-800 flex items-center gap-2 bg-white py-2 px-3 rounded-md text-sm">
                  Signout <PiSignOut className="w-5 h-5" />
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <h2 className="text-2xl font-bold text-center">Orders</h2>
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Customer"
              className="w-full py-2 px-4 bg-transparent border  border-slate-500 rounded-md outline-none focus:shadow-md "
            />{" "}
          </div>
          <div className="flex gap-4 bg-slate-800 p-2 rounded-md">
            {["All", "Pending", "Completed", "Shipped", "Cancelled"].map(
              (status) => (
                <button
                  key={status}
                  className={`text-sm px-4 py-1 rounded-md transition-all ${
                    filter === status ? "bg-white text-slate-800" : "text-white"
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>
          <div className="overflow-y-auto bg-white rounded-md shadow-md">
            <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white  text-sm">
                  <th className="p-4 border">Order ID</th>
                  <th className="p-4 border">Customer Name</th>
                  <th className="p-4 border">Address</th>
                  <th className="p-4 border">Order Date</th>
                  <th className="p-4 border">Total Amount</th>
                  <th className="p-4 border">Status</th>
                  <th className="p-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchOrder().map((order) => (
                  <tr
                    key={order._id}
                    className="cursor-pointer hover:bg-gray-100 transition-all text-sm border"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <td className="p-4 border">{order._id}</td>
                    <td className="p-4 border break-words">
                      {order.customer.firstName} {order.customer.lastName}{" "}
                      <br />
                      {order.customer.email}
                      <br />
                      {order.customer.phone}
                    </td>

                    <td className="p-4 border">
                      {order.customer.streetAddress}
                    </td>
                    <td className="p-4 border">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 border">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-4 border">
                      <select
                        className="border p-2 rounded-md bg-gray-100"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value as Order["status"]
                          )
                        }
                      >
                        {["pending", "completed", "shipped", "cancelled"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="p-4 border flex justify-center gap-2">
                      <button
                        title="delete"
                        className="bg-red-500 text-white p-2 rounded-md flex items-center gap-1 hover:bg-red-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order._id, order.customer?._id);
                        }}
                      >
                        <IoMdTrash className="w-5 h-5" />
                      </button>
                      <button
                        title="Mark as Shipped"
                        className="bg-green-500 text-white p-2 rounded-md flex items-center gap-1 hover:bg-green-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order._id, "completed");
                        }}
                      >
                        <FaSquareCheck className="w-5 h-5" />
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

export default AdminDashboard;
