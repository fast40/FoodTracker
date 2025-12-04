import DefaultLayout from "@/layouts/default";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Food from "@/images/Food Stock Photo 1.jpg";

import { button as buttonStyles } from "@heroui/theme";
import { Button } from "@heroui/react";

export default function Home()
{
  const navigate = useNavigate();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <DefaultLayout>
      <div
        style={{
          width: "50%",
          margin: "60px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "600"}}>
          FoodTracker
        </h1>
        <p style={{fontSize: "1.4rem", marginTop: "5px"}}>
          Track daily nutrients with barcode scans or quick manual entry, and visualize your trends over time.
        </p>
        <Button
          onPress={() => navigate("/add")}
          style={{
            marginTop: "25px",
            paddingTop: "23px",
            paddingBottom: "23px",
            color: "white",
            fontSize: "1.3rem",
            filter: "drop-shadow(0px 4px 4px rgba(202, 153, 255, 0.4))"
          }}
          className={buttonStyles({
            color: "primary",
          })}
        >
          Get Started
        </Button>
      </div>

      <img src={Food} 
      style={{
        marginTop: "6rem",
        width: "100vw",
        maxWidth: "none",
        marginLeft: "calc(50% - 50vw)",
        objectFit: "cover",
      }} />
    </DefaultLayout>
  );
}
