"use client";

import type { ReactElement } from "react";
import JsonSchemaComponentRender from "../../components/JsonSchemaComponentRender";
import { ComponentData } from "../../types/Component";
import { ComponentRegistry } from "../../types/Component";
import TwoPanelComponent from "../../components/TwoPanelComponent";

import { useData } from "../../contexts/DataContext";

const componentRegistry: ComponentRegistry = {
  TwoPanelComponent
} as const;

export default function TwoPanelPage(): ReactElement {
  const { data: allData, isLoading, error } = useData();

  // Filter for TwoPanelComponent data
  const data: ComponentData[] = allData
    .filter(item => item.component === "TwoPanelComponent");

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
