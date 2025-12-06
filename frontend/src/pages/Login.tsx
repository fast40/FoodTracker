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
    <DefaultLayout fullWidth>
      <div className="flex w-full h-[calc(100vh-65px)] items-center">
        <div className="hidden md:block w-1/4 h-full">
          <img
            src={ImageL}
            className="w-full h-full object-cover"
            alt="Login Left"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            <p className="text-1xl text-red-400 mb-3">
              <i>{message}</i>
            </p>

            <Form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 w-full"
            >
              <Input
                label="Username"
                labelPlacement="outside"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
                isRequired
                className="w-full"
              />
              <Input
                label="Password"
                labelPlacement="outside"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                type="password"
                isRequired
                className="w-full"
              />
              <Button type="submit" variant="bordered" className="mt-2 w-full">
                Login
              </Button>
            </Form>
          </div>
        </div>

        <div className="hidden md:block w-1/4 h-full">
          <img
            src={ImageR}
            className="w-full h-full object-cover"
            alt="Login Right"
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
