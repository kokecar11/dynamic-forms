import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { DetailForm } from "./pages/DetailForm"
import { DesignForm } from "./pages/DesignForm"
import { SendForm } from "./pages/Form"
import { PublicOnlyRoute } from "./components/PublicRoute"
import "./globals.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicOnlyRoute>
        <div className="h-screen w-full grid place-items-center">
          <Dashboard />
        </div>
      </PublicOnlyRoute>
    ),
  },
  {
    path: "design-form/:idForm",
    element: (
      <PublicOnlyRoute>
        <div className="h-screen w-full grid place-items-center">
          <DesignForm />
        </div>
      </PublicOnlyRoute>
    ),
  },
  {
    path: "detail-form/:idForm",
    element: (
      <PublicOnlyRoute>
        <div className="h-screen w-full grid place-items-center">
          <DetailForm />
        </div>
      </PublicOnlyRoute>
    ),
  },
  {
    path: "form/:idForm",
    element: (
      <PublicOnlyRoute>
        <div className="h-screen w-full grid place-items-center">
          <SendForm />
        </div>
      </PublicOnlyRoute>
    ),
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
