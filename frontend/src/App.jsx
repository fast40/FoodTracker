import { Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import TestFetch from "@/pages/Test";
import AddFood from "@/pages/AddFood";

function App() {
  return (
    <Routes>
        <Route element={<Dashboard />} path="/" />
        <Route element={<TestFetch />} path="/test" />
        <Route element={<AddFood />} path="/add" />
    </Routes>
  );
}

export default App;