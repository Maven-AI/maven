import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SchemaSummary from "./pages/summary/schema-summary.tsx";
import ErrorPage from "./components/comps/error.tsx";
import Layout from "./layout.tsx";
import Home from "./pages/home/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/summary",
    element: (
      <Layout>
        <SchemaSummary />
      </Layout>
    ),
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
