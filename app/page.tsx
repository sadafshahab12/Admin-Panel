"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

import { useRouter } from "next/navigation";

// const AdminLogin = () => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const router = useRouter();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
//       password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
//     ) {
//       localStorage.setItem("isLogged", "true");
//       router.push("/admin/dashboard");
//     } else {
//       alert("Invalid email or password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="w-full p-2 border border-gray-300 rounded mt-1"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="w-full p-2 border border-gray-300 rounded mt-1"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
export default function AdminLogin() {
  const { user } = useUser();
  const router = useRouter();
  if (
    user &&
    user.primaryEmailAddress?.emailAddress === "sadafshahabsr12@gmail.com"
  ) {
    router.push("/admin/dashboard");
    return <div>Redirecting...</div>;
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-200 gap-4">
      <h1 className="text-3xl font-bold">Admin Login</h1>
      <SignedOut>
        <SignInButton>
          <button className="py-2 px-4 text-sm bg-slate-800 rounded-md cursor-pointer text-white">
            Login with Clerk
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>Sign Out</SignOutButton>
      </SignedIn>
    </div>
  );
}
