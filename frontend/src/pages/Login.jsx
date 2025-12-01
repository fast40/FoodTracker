import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button } from "@heroui/react";

export default function Login()
{
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/food-tracker/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
  }

  return (
    <DefaultLayout>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Username"
          labelPlacement="outside"
          placeholder="Username"
          value={formData.username}
          onChange={ (e) => { setFormData((prev) => ({ ...prev, username: e.target.value })) } }
          isRequired
        />
        <Input
          label="Password"
          labelPlacement="outside"
          placeholder="Password"
          value={formData.password}
          onChange={ (e) => { setFormData((prev) => ({ ...prev, password: e.target.value })) } }
          type="password"
          isRequired
        />
        <Button
          type="submit"
          variant="bordered"
        >
          Login
        </Button>
      </Form>
    </DefaultLayout>
  );
}
