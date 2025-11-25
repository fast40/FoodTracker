import { Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import Test from "@/pages/Test";

function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="FoodTracker/" />
      <Route element={<Test />} path="FoodTracker/test" />
    </Routes>
  );
}

export default App;