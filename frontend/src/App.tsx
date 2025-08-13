import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { setToken } from "./lib/api";
import "./styles.css";

import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import NewAnimal from "./pages/NewAnimal";
import Listings from "./pages/Listings";
import NewListing from "./pages/NewListing";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";

function RequireAuth({ children }:{children: JSX.Element}) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  useEffect(() => { const token = localStorage.getItem("token"); setToken(token || undefined); }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/animals" element={<RequireAuth><Animals/></RequireAuth>} />
        <Route path="/new-animal" element={<RequireAuth><NewAnimal/></RequireAuth>} />
        <Route path="/listings" element={<RequireAuth><Listings/></RequireAuth>} />
        <Route path="/new-listing" element={<RequireAuth><NewListing/></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth><Messages/></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><Admin/></RequireAuth>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}