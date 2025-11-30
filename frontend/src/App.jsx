import { Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import AddFood from "@/pages/AddFood";
import Login from "@/pages/Login"
import Register from "@/pages/Register"

function App() {
  return (
    <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<AddFood />} path="/add" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
    </Routes>
  );
}

export default App;
