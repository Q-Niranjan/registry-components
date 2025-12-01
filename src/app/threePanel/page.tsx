"use client";

import type { ReactElement } from "react";
import JsonSchemaComponentRender from "../../components/JsonSchemaComponentRender";
import { ComponentData } from "../../types/Component";
import { ComponentRegistry } from "../../types/Component";
import ThreePanelComponent from "../../components/ThreePanelComponent";

import { useData } from "../../contexts/DataContext";

const componentRegistry: ComponentRegistry = {
  ThreePanelComponent
} as const;

export default function ThreePanelPage(): ReactElement {
  const { data: allData, isLoading, error } = useData();

  // Filter for ThreePanelComponent data
  const data: ComponentData[] = allData
    .filter(item => item.component === "ThreePanelComponent");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <JsonSchemaComponentRender
      data={data}
      defaultLayout="vertical"
      componentRegistry={componentRegistry}
    />
  );
}
