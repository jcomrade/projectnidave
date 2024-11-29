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
      className="bg-transparent border-2 border-white border-opacity-30 text-white outline-none"
      onClick={() => signOutUser()}
    >
      Sign Out
    </button>
  );
};

export default SignoutButton;
