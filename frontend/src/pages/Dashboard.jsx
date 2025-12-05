import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { DayGraph } from "@/components/dayGraph";
import { RangeGraph } from "@/components/rangeGraph";

import { Button } from "@heroui/react";
import { color } from "framer-motion";


export default function Dashboard() {
  const [view, setView] = useState("day");

  return (
    <DefaultLayout>
      {/*<h1 className="text-2xl font-semibold">Dashboard</h1>*/}

      <Button
        onClick={() => setView("day")}
        color = {view === "day" ? "primary" : "default"}
        style = {{ color: view === "day" ? "white" : "gray"}}
        className="rounded-l-lg rounded-r-none"
      >
        Day
      </Button>
      <Button
        onClick={() => setView("week")}
        color = {view === "week" ? "primary" : "default"}
        style = {{ color: view === "week" ? "white" : "gray"}}
        className="rounded-l-none rounded-r-lg"
      >
        Week
      </Button>
      {/*<Button
        onClick={() => setView("month")}
        color = {view === "month" ? "primary" : "default"}
        style = {{ color: view === "month" ? "white" : "gray"}}
        className="rounded-l-none rounded-r-lg"
      >
        Month
      </Button>*/}

      {view === "day" && <DayGraph />}
      {view === "week" && <RangeGraph />}
      {view === "month" && <RangeGraph />}
    </DefaultLayout>
  );
}