import { groq } from "next-sanity";

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

export interface RentalCustomer {
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

export interface RentalOrder {
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

export const groqOrderQuery = groq`*[_type == "order"] {
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
  }`;
export const groqRentalOrderQuery = groq`*[_type == "rentalOrder"] {
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
                 }`;
