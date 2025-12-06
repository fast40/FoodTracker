import DefaultLayout from "@/layouts/default";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RegisterForm } from "@/components/RegisterForm";

import ImageL from "@/images/Login Image L.jpg";
import ImageR from "@/images/Login Image R.jpg";

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

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
            alt="Register Left"
          />
        </div>

        <div className="w-full md:w-1/2 mt-[-70px] flex flex-col justify-center px-8">
          <div className="max-w-md mx-auto w-full">
            <RegisterForm onSuccess={() => navigate("/")} />
          </div>
        </div>

        <div className="hidden md:block w-1/4 h-full">
          <img
            src={ImageR}
            className="w-full h-full object-cover"
            alt="Register Right"
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
