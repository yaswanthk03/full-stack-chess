import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/app-layout";
import LandingPage from "./pages/landing-page";
import Game from "./pages/game";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <LandingPage />,
        path: "/",
      },
      {
        element: <Game />,
        path: "/game",
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
