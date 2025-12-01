"use client";

import React from "react";
import type { BaseComponentProps } from "../types/Component";
import { libComponentRender } from "./libComponents/libComponentRender";

const TwoPanelComponent: React.FC<BaseComponentProps> = ({
  title,
  schema,
  libComponentRegistry,
  onEdit
}) => {
  // Split schema properties into two columns
  const allProperties = Object.entries(schema.properties || {});
  const col1Props = Object.fromEntries(allProperties.slice(0, 3));
  const col2Props = Object.fromEntries(allProperties.slice(3, 6));

  const schema1 = { ...schema, properties: col1Props };
  const schema2 = { ...schema, properties: col2Props };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm max-w-6xl mx-auto">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-gray-900">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="md:border-r md:border-gray-300 md:pr-8">
            {libComponentRender({ schema: schema1, libComponentRegistry })}
          </div>
          <div className="md:pl-4">
            {libComponentRender({ schema: schema2, libComponentRegistry })}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-auto">
          <button
            onClick={onEdit}
            className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
          >
            Edit Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoPanelComponent;
