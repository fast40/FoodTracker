import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button } from "@heroui/react";
import { useAuth } from "../context/AuthContext";

export default function Register()
{
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/food-tracker/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    login(formData);
    navigate("/");
  }

  return (
    <DefaultLayout>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Email"
          onChange={ (e) => { setFormData((prev) => ({ ...prev, email: e.target.value })) } }
          type="email"
          isRequired
        />
        <Input
          label="Username"
          labelPlacement="outside"
          placeholder="Username"
          onChange={ (e) => { setFormData((prev) => ({ ...prev, username: e.target.value })) } }
          isRequired
        />
        <Input
          label="Password"
          labelPlacement="outside"
          placeholder="Password"
          onChange={ (e) => { setFormData((prev) => ({ ...prev, password: e.target.value })) } }
          type="password"
          isRequired
        />
        <Input
          label="Confirm Password"
          labelPlacement="outside"
          placeholder="Confirm Password"
          type="password"
          isRequired
        />
        <Button
          type="submit"
          variant="bordered"
        >
          Register
        </Button>
      </Form>
    </DefaultLayout>
  );
}
