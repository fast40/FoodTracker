import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button } from "@heroui/react";

export default function Register()
{
  return (
    <DefaultLayout>
      <Form>
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Email"
          type="email"
          isRequired
        />
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
