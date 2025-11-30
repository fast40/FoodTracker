import { Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import AddFood from "@/pages/AddFood";
import Login from "@/pages/Login"
import Register from "@/pages/Register"

function App() {
  return (
    <Routes>
        <Route element={<Dashboard />} path="/" />
        <Route element={<AddFood />} path="/add" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
    </Routes>
  );
}

export default App;
