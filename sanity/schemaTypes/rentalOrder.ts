// schemas/rentalOrder.js
export const rentalOrder = {
    name: "rentalOrder",
    title: "Rental Order",
    type: "document",
    fields: [
      {
        name: "product",
        type: "string",
        title: "Product",
      },
      {
        name: "productImage",
        title: "Product Image",
        type: "image",
      },
  
      {
        name: "rentalPricePerDay",
        type: "number",
        title: "Rental Price Per Day",
      },
      {
        name: "rentalStartDate",
        type: "string",
        title: "Rental Start Date",
      },
      {
        name: "rentalEndDate",
        type: "string",
        title: "Rental End Date",
      },
      {
        name: "totalDays",
        type: "number",
        title: "Total Rental Days",
      },
      {
        name: "quantity",
        type: "number",
        title: "Quantity",
      },
      {
        name: "totalPrice",
        type: "number",
        title: "Total Price",
      },
      {
        name: "status",
        title: "Status",
        type: "string",
        options: {
          list: [
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
          ],
        },
        initialValue: "Pending", // Default status when order is created
      },
      {
        name: "customerId",
        type: "reference",
        to: [{ type: "rentalCustomer" }],
      },
    ],
  };
  