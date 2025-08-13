import { Routes, Route } from "react-router-dom";
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

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/animals" element={<Animals/>} />
      <Route path="/edit-animal/:id" element={<EditAnimal/>} />
      <Route path="/listings" element={<Listings/>} />
      <Route path="/new-listing" element={<NewListing/>} />
      <Route path="/edit-listing/:id" element={<EditListing/>} />
      <Route path="/messages" element={<Messages/>} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/vets" element={<Vets/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  )
}
