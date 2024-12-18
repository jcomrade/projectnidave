// VerticalSeparator.js
import React from "react";
import { useNavigate } from "react-router-dom";
const SignoutButton = () => {
  const navigate = useNavigate();
  async function signOutUser() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`, {
        method: "GET",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Error fetching playlist:", err);
    }
  }
  return (
    <button
      className="bg-transparent text-[#FFFFFF] outline-none hover:bg-red-500 hover:text-black text-xs md:text-lg"
      onClick={() => signOutUser()}
    >
      Sign Out
    </button>
  );
};

export default SignoutButton;
