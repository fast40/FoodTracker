import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home()
{
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div
        style={{
          margin: "80px auto",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p>TODO: Show user history here...</p>
      </div>
    </DefaultLayout>
  );
}
