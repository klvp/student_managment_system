import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddStudent = lazy(() => import("./pages/AddStudent"));
const EditStudent = lazy(() => import("./pages/EditStudent"));
import { Provider } from "react-redux";
import store from "@/store/index";
import Layout from "./pages/Layout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout>
          <Login />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout>
          <Dashboard />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/add/:studentId?",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout>
          <AddStudent />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/edit",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EditStudent />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
