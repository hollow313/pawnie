import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import EditAnimal from "./pages/EditAnimal";
import Listings from "./pages/Listings";
import NewListing from "./pages/NewListing";
import EditListing from "./pages/EditListing";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Vets from "./pages/Vets";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authed = !!token;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/animals" element={authed ? <Animals /> : <Navigate to="/login" />} />
      <Route path="/edit-animal/:id" element={authed ? <EditAnimal /> : <Navigate to="/login" />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/new-listing" element={authed ? <NewListing /> : <Navigate to="/login" />} />
      <Route path="/edit-listing/:id" element={authed ? <EditListing /> : <Navigate to="/login" />} />
      <Route path="/messages" element={authed ? <Messages /> : <Navigate to="/login" />} />
      <Route path="/admin" element={authed ? <Admin /> : <Navigate to="/login" />} />
      <Route path="/profile" element={authed ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/vets" element={<Vets />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
