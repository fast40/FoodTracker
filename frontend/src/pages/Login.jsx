import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login()
{
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    login(formData);
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
