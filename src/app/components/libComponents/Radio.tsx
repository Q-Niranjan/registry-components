"use client";

import React, { useMemo } from "react";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

interface RadioProps {
  schema: JsonSchema;
}

const Radio: React.FC<RadioProps> = ({ schema }) => {
  const generatedUiSchema: UISchemaElement = useMemo(() => {
	const properties = schema.properties || {};
	const firstKey = Object.keys(properties)[0];     
	return {
	  type: "Control",
	  scope: `#/properties/${firstKey}`,
	  options: {
		format: "radio"
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

export default Radio;
