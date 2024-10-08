"use client";
import FlowChart from "@/components/FlowChart";
import Leftbar from "@/components/Leftbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [selectedFlow, setSelectedFlow] = useState("");

  return (
    <div className="flex h-screen bg-[#181E25]  text-white">
      <Leftbar />
      <div className="flex-1 flex flex-col">
        <FlowChart />
      </div>
      <Sidebar selectedFlow={selectedFlow} setSelectedFlow={setSelectedFlow} />
    </div>
  );
}
