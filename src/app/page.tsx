"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import JsonSchemaComponentRender from "./components/JsonSchemaComponentRender";
import { ComponentData } from "./types/Component";
import { ApiResponse, ComponentResponse } from "./types/ApiResponse";
import { ComponentRegistry } from "./types/Component";
import OnePanelComponent from "./components/OnePanelComponent";


/**
 * Component registry mapping component names to React components
 */
const componentRegistry: ComponentRegistry = {
  OnePanelComponent
} as const;

export default function Home(): ReactElement {
  const [data, setData] = useState<ComponentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const json: ApiResponse = await response.json();

        // Data is a list of dictionaries (array)
        const componentData: ComponentData[] = json.map(
          (item: ComponentResponse): ComponentData => {
            return {
              component: item.component,
              title: item.title,
              originalSchema: item.schema,
              schema: item.schema as ComponentData["schema"],
              layout: item.layout ?? "vertical",
            };
          }
        );

        setData(componentData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchData();
  }, []);

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
