"use client";

import React, { useState } from "react";
import {JsonForms} from '@jsonforms/react'
import { JsonSchema, UISchemaElement } from "@jsonforms/core";

import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";

import { PanelData } from "../types/Panel";
import { ajv } from "@/lib/jsonforms-ajv";



const PanelTile: React.FC<{ data: PanelData }> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const panelType = data.panelType;
  const properties = data.schema.properties || {};
  const fieldKeys = Object.keys(properties);

  let panelFields: string[][] = [];

  if (panelType === "1-panel") {
    panelFields = [fieldKeys.slice(0, 3)];
  } else if (panelType === "2-panel") {
    panelFields = [
      fieldKeys.slice(0, 3),
      fieldKeys.slice(3, 6),
    ];
  } else if (panelType === "3-panel") {
    panelFields = [
      fieldKeys.slice(0, 3),
      fieldKeys.slice(3, 6),
      fieldKeys.slice(6, 9),
    ];
  } else if (panelType === "6-panel") {
    panelFields = [
      fieldKeys.slice(0, 3),
      fieldKeys.slice(3, 6),
      fieldKeys.slice(6, 9),
      fieldKeys.slice(9, 12),
      fieldKeys.slice(12, 15),
      fieldKeys.slice(15, 18),
    ];
  }

  const uiSchema: UISchemaElement = {
    type: "HorizontalLayout",
    elements: panelFields.map((fields) => ({
      type: "VerticalLayout",
      elements: fields.map((field) => ({        
        type: "Control",
        scope: `#/properties/${field}`,
      })),
    })),
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-400 overflow-hidden shadow-sm w-fit">
      <h2 className="text-lg font-bold text-black px-6 py-2">
        {data.panelTitle}
      </h2>

      <div className="px-6 py-5">
        {isEditing ? (
          <div className="w-full">
            <JsonForms
              schema={data.schema as JsonSchema}
              uischema={uiSchema}
              data={formData}
              cells={materialCells}
              renderers={materialRenderers}
              ajv={ajv}
              onChange={({ data }) => setFormData(data)}
            />

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="w-fit">
            <JsonForms
              schema={data.schema as JsonSchema}
              uischema={uiSchema}
              data={formData}
              readonly={true}
              renderers={materialRenderers}
              cells={materialCells}
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 mt-2 mx-6">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 text-gray-900 font-medium hover:bg-gray-50 w-full"
          >
            Edit Details ➜
          </button>
        )}
      </div>
    </div>
  );
};

export default PanelTile;
