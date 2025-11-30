import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@heroui/react";

export default function Home()
{
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div>
        <p>Ready to start tracking your food?</p>
        <Button onPress={() => navigate("/register")}>
          Sign up
        </Button>
      </div>
    </DefaultLayout>
  );
}
