"use client";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { Order, RentalOrder } from "../data-types/data";

const Navbar = () => {
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [rentalOrders, setRentalOrders] = useState<RentalOrder[]>([]);

  useEffect(() => {
    if (pathname === "/admin/dashboard" || pathname === "/order-page") {
      client
        .fetch(
          groq`*[_type == "order"] {
            _id, _createdAt, _updatedAt, status, totalPrice, userId,
            cartItems[] {_id, title, price, image},
            customer-> {_id, firstName, lastName, email, phone, streetAddress}
          }`
        )
        .then((data) => setOrders(data))
        .catch((err) => console.error("Error fetching orders", err));
    }

    if (pathname === "/admin/dashboard" || pathname === "/rental-order") {
      client
        .fetch(
          groq`*[_type == "rentalOrder"] {
            _id, rentalStartDate, rentalEndDate, quantity, totalPrice, 
            rentalPricePerDay, totalDays, status, _createdAt, _updatedAt
          }`
        )
        .then((data) => setRentalOrders(data))
        .catch((err) => console.error("Error fetching rental orders", err));
    }
  }, [pathname]);

  let revenue = 0;
  let totalOrders = 0;
  let totalCustomers = 0;
  let pendingDeliveries = 0;

  if (pathname === "/admin/dashboard") {
    revenue =
      orders.reduce((acc, order) => acc + order.totalPrice, 0) +
      rentalOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    totalOrders = orders.length + rentalOrders.length;
    totalCustomers = new Set(
      [...orders, ...rentalOrders].map((order) => order._id)
    ).size;
    pendingDeliveries = [...orders, ...rentalOrders].filter(
      (order) => order.status === "pending"
    ).length;
  } else if (pathname === "/order-page") {
    revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    totalOrders = orders.length;
    totalCustomers = new Set(orders.map((order) => order._id)).size;
    pendingDeliveries = orders.filter(
      (order) => order.status === "pending"
    ).length;
  } else if (pathname === "/rental-order") {
    revenue = rentalOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    totalOrders = rentalOrders.length;
    totalCustomers = new Set(rentalOrders.map((order) => order._id)).size;
    pendingDeliveries = rentalOrders.filter(
      (order) => order.status === "pending"
    ).length;
  }

  return (
    <nav className="flex justify-between items-center bg-slate-800 p-5">
      <div className="text-white">
        <RiDashboardFill className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 p-5">
        <div className="bg-white shadow-md p-4 text-center rounded-md">
          <h2 className="text-lg font-bold">Revenue</h2>
          <p className="text-lg text-green-600">${revenue.toFixed(2)}</p>
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
  );
};

export default Navbar;
