import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Display from "../display/Display.tsx";

const router = createBrowserRouter([
  {
    element: <Outlet />,

    children: [{ path: "/", element: <Display /> }],
  },
]);

export default router;
