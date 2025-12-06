import { Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import AddFood from "@/pages/AddFood";
import History from "@/pages/History";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Settings from "@/pages/Settings";
import Logout from "@/pages/Logout";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<AddFood />} path="/add" />
      <Route element={<History />} path="/history" />
      <Route element={<Login />} path="/login" />
      <Route element={<Logout />} path="/logout" />
      <Route element={<Register />} path="/register" />
      <Route element={<Settings />} path="/settings" />
    </Routes>
  );
}

export default App;
