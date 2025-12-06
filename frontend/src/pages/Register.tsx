import DefaultLayout from "@/layouts/default";
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button } from "@heroui/react";
import { useAuth } from "../context/AuthContext";

import ImageL from "@/images/Login Image L.jpg";
import ImageR from "@/images/Login Image R.jpg";

export default function Register() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (formData.password != formData.confPassword) {
      setMessage("*Passwords do not match!");
      return;
    }

    await fetch("http://localhost:8080/food-tracker/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    login(formData);
    navigate("/");
  }

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <DefaultLayout>
      <img
        src={ImageL}
        className="absolute left-[-200px] top-[64px] h-[calc(100vh-64px)] w-auto z-0 object-cover"
      />
      <img
        src={ImageR}
        className="absolute right-[-200px] top-[64px] h-[calc(100vh-64px)] w-auto z-0 object-cover"
      />

      <div className="max-w-3xl mx-auto mt-3">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <p className="text-1xl text-red-400 mb-3">
          <i>{message}</i>
        </p>

        <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="Email"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }));
            }}
            type="email"
            isRequired
          />
          <Input
            label="Username"
            labelPlacement="outside"
            placeholder="Username"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, username: e.target.value }));
            }}
            isRequired
          />
          <Input
            label="Password"
            labelPlacement="outside"
            placeholder="Password"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
            }}
            type="password"
            isRequired
          />
          <Input
            label="Confirm Password"
            labelPlacement="outside"
            placeholder="Confirm Password"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                confPassword: e.target.value,
              }));
            }}
            type="password"
            isRequired
          />
          <Button type="submit" variant="bordered" className="mt-2">
            Register
          </Button>
        </Form>
      </div>
    </DefaultLayout>
  );
}
