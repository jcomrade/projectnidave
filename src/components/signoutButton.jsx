// VerticalSeparator.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
const SignoutButton = () => {
  const { logout } = useAuth0();
  // async function signOutUser() {
  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`, {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     navigate("/");
  //   } catch (err) {
  //     console.error("Error fetching playlist:", err);
  //   }
  // }
  return (
    <button
      className="bg-transparent text-[#FFFFFF] outline-none hover:bg-red-500 hover:text-black text-xs md:text-lg"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Sign Out
    </button>
  );
};

export default SignoutButton;
