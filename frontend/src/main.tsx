import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./providers/theme-provider";

import "./index.css";

import { router } from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />,
    </ThemeProvider>
  </React.StrictMode>,
);
