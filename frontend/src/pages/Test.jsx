import { useState } from "react";

export default function Test() {
  const [data, setData] = useState(null);

  async function hitBackend() {
    try {
      const res = await fetch("http://localhost:8080/FoodTracker/api/data-viz");
      if (!res.ok)
        throw new Error("Request failed");
      
      const json = await res.json();
      if (!res.success)
        throw new Error("Missing data");

      setData("Calories: " + json.calories +
            "\nProtein: " + json.protein +
            "\nCarbohydrates: " + json.carbohydrates +
            "\nFat: " + json.fat +
            "\nSugar: " + json.sugar +
            "\nFiber: " + json.fiber +
            "\nSodium: " + json.sodium);
    } catch (err) {
      setData("ERROR: " + err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>React ↔ Tomcat Test</h1>

      <button onClick={hitBackend}>Call Servlet</button>

      <div style={{ marginTop: 20 }}>
        {data && <p>Response: {data}</p>}
      </div>
    </div>
  );
}