export const orderSchema = {
    title: "Order",
    name: "order",
    type: "document",
    fields: [
      {
        name: "customer",
        title: "Customer",
        type: "reference",
        to: { type: "customer" },
      },
      {
        name: "cartItems",
        title: "Cart Items",
        type: "array",
        of: [{ type: "reference", to: { type: "furniture" } }],
      },
  
      {
        name: "totalPrice",
        title: "Total Price",
        type: "number",
      },
      {
        name: "paymentMethod",
        title: "Payment Method",
        type: "string",
      },
      {
        name: "status",
        title: "Order Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Success", value: "success" },
            { title: "Dispatch", value: "dispatch" },
            { title: "Delivered", value: "delivered" },
            { title: "Cancelled", value: "cancelled" },
          ],
          layout: "radio",
        },
        initialValue: "pending",
      },
    ],
  };
  