"use client";

import React, { useMemo } from "react";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

interface DropDownProps {
  schema: JsonSchema;
}

const DropDown: React.FC<DropDownProps> = ({ schema }) => {
  const generatedUiSchema: UISchemaElement = useMemo(() => {
    const properties = schema.properties || {};
    const firstKey = Object.keys(properties)[0];     
    return {
      type: "Control",
      scope: `#/properties/${firstKey}`,
      options: {
        format: "select"
      }
    };
  }, [schema]);

  return (
    <div className="p-2">
      <JsonForms
        schema={schema}
        uischema={generatedUiSchema}
        data={{}}
        renderers={materialRenderers}
        cells={materialCells}
      />
    </div>
  );
};

export default DropDown;
