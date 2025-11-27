import { JsonSchema, UISchemaElement } from "@jsonforms/core";

export interface PanelData {
  component_name: string;   // Which component to render
  tile: string;             // The panel title
  schema: JsonSchema;       // JSON schema
  uiSchema?: UISchemaElement; // UI Schema
}
