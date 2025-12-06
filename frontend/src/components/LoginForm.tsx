import { useState, FormEvent } from "react";
import { Form, Input, Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { message, login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login(formData);
    if (onSuccess) onSuccess();
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <p className="text-1xl text-red-400 mb-3">
        <i>{message}</i>
      </p>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
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
  );
}
