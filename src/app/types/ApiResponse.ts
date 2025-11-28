import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { NestedComponentProperty } from "./Component";

/**
 * Component data structure from API response
 */
export interface ComponentResponse {
  component_name: string;
  title: string;
  schema: JsonSchema | NestedComponentProperty;
  uischema?: UISchemaElement;
  uiSchema?: UISchemaElement;
  layout?: "vertical" | "horizontal";
}

/**
 * API response - list of component data (array of dictionaries)
 */
export type ApiResponse = ComponentResponse[];
