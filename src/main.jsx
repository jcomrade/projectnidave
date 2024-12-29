import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={`${import.meta.env.VITE_AUTH0_DOMAIN}`}
    clientId={`${import.meta.env.VITE_AUTH0_CLIENTID}`}
    redirectUri={window.location.origin}
    audience={import.meta.env.VITE_BACKEND_URL}
  >
    <App />
  </Auth0Provider>
);
