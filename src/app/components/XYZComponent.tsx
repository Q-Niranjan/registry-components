"use client";

import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import type { UISchemaElement } from "@jsonforms/core";

import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";

import { ajv } from "@/lib/jsonforms-ajv";
import type { BaseComponentProps } from "../types/Component";

const XYZComponent: React.FC<BaseComponentProps> = ({
  title,
  schema,
  uiSchema,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* JSONForms Renderer */}
      <JsonForms
        ajv={ajv}
        schema={schema}
        uischema={uiSchema as UISchemaElement}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setFormData(data)}
      />
    </div>
  );
};

export default XYZComponent;
