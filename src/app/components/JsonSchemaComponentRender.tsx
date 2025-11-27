"use client";

import React from "react";
import OnePanelComponent from "./OnePanelComponent";
import TwoPanelComponent from "./TwoPanelComponent";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import ThreePanelComponent from "./ThreePanelComponent";


type PanelItem = {
  component_name: string;
  tile: string;
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
};

const componentMap: Record<string, React.ComponentType<any>> = {
  OnePanelComponent: OnePanelComponent,
  TwoPanelComponent: TwoPanelComponent,
  ThreePanelComponent: ThreePanelComponent,

};

export default function JsonSchemaComponentRender({
  panels,
}: {
  panels: PanelItem[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {panels.map((item, index) => {
        const Component = componentMap[item.component_name];

        if (!Component) {
          return (
            <div key={index} className="p-4 bg-red-100 text-red-600 rounded">
              Unknown Component: {item.component_name}
            </div>
          );
        }

        return (
          <Component
            key={index}
            title={item.tile}
            schema={item.schema}
            uiSchema={item.uiSchema}
          />
        );
      })}
    </div>
  );
}
