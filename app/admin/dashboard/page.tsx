"use client";

import {
  groqOrderQuery,
  groqRentalOrderQuery,
  Order,
  RentalOrder,
} from "@/app/data-types/data";
import { client } from "@/sanity/lib/client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rentalOrders, setRentalOrders] = useState<RentalOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch regular orders
        const regularOrdersData = await client.fetch(groqOrderQuery);
        setOrders(regularOrdersData);
      } catch (err) {
        console.error("Error fetching regular orders", err);
      }

      try {
        // Fetch rental orders
        const rentalOrdersData = await client.fetch(groqRentalOrderQuery);
        setRentalOrders(rentalOrdersData);
      } catch (err) {
        console.error("Error fetching rental orders", err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    console.log(orders); // Log state changes
  }, [orders]);

  useEffect(() => {
    console.log(rentalOrders); // Log state changes
  }, [rentalOrders]);

  return (
    <div className="flex flex-col  bg-gray-300">
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
