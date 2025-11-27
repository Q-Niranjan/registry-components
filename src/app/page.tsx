"use client";

import { useEffect, useState } from "react";

import PanelTile from "./components/PanelTile";
import { PanelData } from "./types/Panel";
import { ApiResponse } from "./types/ApiResponse";

export default function Home() {
  const [panels, setPanels] = useState<PanelData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const json: ApiResponse = await res.json();

      const panelArray: PanelData[] = Object.values(json).map((section: any) => ({
        schema: section.schema,       
        uiSchema: section.uiSchema, 
        panelType: section.panelType,
        panelTitle: section.panelTitle,
      }));

      setPanels(panelArray);
    }

    fetchData();
  }, []);

  if (panels.length === 0) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 space-y-10">
      {panels.map((panel, i) => (
        <PanelTile key={i} data={panel} />
      ))}
    </div>
  );
}
