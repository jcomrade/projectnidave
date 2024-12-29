import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="bg-transparent outline-none hover:bg-blue-300 text-[#FFFFFF] px-2 py-1 md:px-auto md:px-auto hover:text-black text-xs md:text-lg" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default Login;
