"use client";

import { useEffect, useState } from "react";

import JsonSchemaComponentRender from "./components/JsonSchemaComponentRender";
import { PanelData } from "./types/Panel";
import { ApiResponse } from "./types/ApiResponse";

export default function Home() {
  const [panels, setPanels] = useState<PanelData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const json: ApiResponse = await res.json();

      const panelArray: PanelData[] = Object.values(json).map((section: any) => ({
        component_name: section.component_name,
        tile: section.tile,
        schema: section.schema,
        uiSchema: section.uiSchema,
      }));

      setPanels(panelArray);
    }

    fetchData();
  }, []);

  if (panels.length === 0) return <p className="p-10">Loading...</p>;

  return<div className="p-8">

    <JsonSchemaComponentRender panels={panels} />

  </div>
  
}
