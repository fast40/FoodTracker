import { useState, FormEvent } from "react";
import { Form, Input, Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (formData.password != formData.confPassword) {
      setMessage("*Passwords do not match!");
      return;
    }

    try {
      await api.auth.register(formData);
      await login(formData);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error(e);
      setMessage("Registration failed");
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <p className="text-1xl text-red-400 mb-3">
        <i>{message}</i>
      </p>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Email"
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
          }}
          type="email"
          isRequired
          className="w-full"
        />
        <Input
          label="Username"
          labelPlacement="outside"
          placeholder="Username"
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
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, password: e.target.value }));
          }}
          type="password"
          isRequired
          className="w-full"
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
          className="w-full"
        />
        <Button type="submit" variant="bordered" className="mt-2 w-full">
          Register
        </Button>
      </Form>
    </div>
  );
}
