import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { DayGraph } from "@/components/dayGraph";
import { RangeGraph } from "@/components/rangeGraph";

import { Button } from "@heroui/react";


export default function Dashboard() {
  
  const today = new Date();
  const offset = new Date().getTimezoneOffset(); // in minutes
  const localDate = new Date(today).getTime() - offset * 60000;

  const [date, setDate] = useState(new Date(localDate).toISOString().slice(0, 10));

  const [view, setView] = useState("day");


  return (
    <DefaultLayout>
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

      {view === "day" && <DayGraph date={date} setDate={setDate} />}
      {view === "week" && <RangeGraph date={date} setDate={setDate} />}
    </DefaultLayout>
  );
}