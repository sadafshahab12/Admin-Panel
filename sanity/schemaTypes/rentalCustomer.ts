// schemas/customer.js
export const rentalCustomer =  {
    name: "rentalCustomer",
    title: "Rental Customer",
    type: "document",
    fields: [
      {
        name: "fullName",
        type: "string",
        title: "Full Name",
      },
      {
        name: "email",
        type: "string",
        title: "Email",
      },
      {
        name: "phone",
        type: "string",
        title: "Phone",
      },
      {
        name: "address",
        type: "string",
        title: "Address",
      },
      {
        name: "country",
        type: "string",
        title: "Country",
      },
      {
        name: "city",
        type: "string",
        title: "City",
      },
      {
        name: "state",
        type: "string",
        title: "State",
      },
      {
        name: "zipCode",
        type: "string",
        title: "Zip Code",
      },
    ],
  };
  