"use client";

import React from "react";
import type { BaseComponentProps } from "../types/Component";
import { libComponentRender } from "./libComponents/libComponentRender";

// it will render only 1*3 attributes only 
const OnePanelComponent: React.FC<BaseComponentProps> = ({
  title,
  schema,
  libComponentRegistry,
  onEdit
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm max-w-4xl mx-auto">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-gray-900">{title}</h2>

        <div className="mb-6">
          {libComponentRender({ schema, libComponentRegistry })}
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

export default OnePanelComponent;
