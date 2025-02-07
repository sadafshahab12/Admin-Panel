"use client";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";

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
const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rentalOrders, setRentalOrders] = useState<RentalOrder[]>([]);

  useEffect(() => {
    // Fetch regular orders
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
      .catch((err) => console.error("Error fetching regular orders", err));

    // Fetch rental orders
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
      .catch((err) => console.error("Error fetching rental orders", err));
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const rentalRevenue = rentalOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );
  const combinedRevenue = totalRevenue + rentalRevenue;

  const totalOrders = orders.length + rentalOrders.length;
  const totalCustomers = new Set(
    [...orders, ...rentalOrders].map((order) => order._id)
  ).size;
  const pendingDeliveries = [...orders, ...rentalOrders].filter(
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
            <p className="text-lg text-green-600">
              ${combinedRevenue.toFixed(2)}
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
        <Link href="/">
          <button className="text-slate-800 flex items-center gap-2 bg-white py-2 px-3 rounded-md text-sm">
            Signout <PiSignOut className="w-5 h-5" />
          </button>
        </Link>
      </nav>
      <div className="p-10 grid grid-cols-2 gap-10 ">
        <div className="h-[20rem] w-full bg-slate-800 flex justify-center items-center text-white rounded-md hover:scale-105 transition-all cursor-pointer duration-500">
          <Link href="/order-page" className="text-3xl font-bold ">
            Order
          </Link>
        </div>
        <div className="h-[20rem] w-full bg-slate-800 flex justify-center items-center text-white rounded-md hover:scale-105 transition-all cursor-pointer duration-500">
          <Link href="/rental-order" className="text-3xl font-bold ">
            Rental Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
