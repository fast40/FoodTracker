import DefaultLayout from "@/layouts/default";
import { useEffect, useState, FormEvent } from "react";
import { Form, Input, Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import ImageL from "@/images/Login Image L.jpg";
import ImageR from "@/images/Login Image R.jpg";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { user, message, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login(formData);
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
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <p className="text-1xl text-red-400 mb-3">
          <i>{message}</i>
        </p>

        <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Username"
            labelPlacement="outside"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, username: e.target.value }));
            }}
            isRequired
          />
          <Input
            label="Password"
            labelPlacement="outside"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
            }}
            type="password"
            isRequired
          />
          <Button type="submit" variant="bordered" className="mt-2">
            Login
          </Button>
        </Form>
      </div>
    </DefaultLayout>
  );
}
