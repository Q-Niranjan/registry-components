"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";

import { ajv } from "@/lib/jsonforms-ajv";
import AadhaarRenderer, { aadhaarTester } from "./AdharComponent";
import type { BaseComponentProps } from "../types/Component";

const OnePanelComponent: React.FC<BaseComponentProps> = ({ title, schema, uiSchema }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // extract first 3 properties
  const fieldKeys = Object.keys(schema.properties || {});
  const panelFields = fieldKeys.slice(0, 3);

  // default fallback uiSchema if not provided
  const generatedUiSchema: UISchemaElement = {
    type: "HorizontalLayout",
    elements: [
      {
        type: "VerticalLayout",
        elements: panelFields.map((field) => ({
          type: "Control",
          scope: `#/properties/${field}`,
        })),
      },
    ],
  };

  // use incoming uiSchema OR auto-generated one
  const finalUiSchema = uiSchema ?? generatedUiSchema;

  return (
    <div className="bg-white rounded-lg border border-gray-400 shadow-sm w-fit">
      <h2 className="text-lg font-bold text-black px-6 py-2">{title}</h2>

      <div className="px-6 py-5">
        {isEditing ? (
          <>
            <JsonForms
              schema={schema}
              uischema={finalUiSchema}
              data={formData}
              cells={materialCells}
              renderers={[
                ...materialRenderers,
                { tester: aadhaarTester, renderer: AadhaarRenderer },
              ]}
              ajv={ajv}
              onChange={({ data }) => setFormData(data)}
            />

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <JsonForms
            schema={schema}
            uischema={finalUiSchema}
            data={formData}
            readonly
            renderers={materialRenderers}
            cells={materialCells}
          />
        )}
      </div>

      {!isEditing && (
        <div className="border-t border-gray-300 mx-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 text-gray-900 font-medium hover:bg-gray-50 w-full"
          >
            Edit Details ➜
          </button>
        </div>
      )}
    </div>
  );
};

export default OnePanelComponent;
