import { JsonSchema, UISchemaElement } from "@jsonforms/core";


export type PanelType = "1-panel" | "2-panel" | "3-panel" | "6-panel";

export interface PanelData {
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
  panelType: PanelType;
  panelTitle: string;
}
