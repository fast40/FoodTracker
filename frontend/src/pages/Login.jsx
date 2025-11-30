import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button } from "@heroui/react";

export default function Login()
{
  return (
    <DefaultLayout>
      <Form>
        <Input
          label="Username"
          labelPlacement="outside"
          placeholder="Username"
          isRequired
        />
        <Input
          label="Password"
          labelPlacement="outside"
          placeholder="Password"
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
