import { JsonSchema } from "@jsonforms/core";
import { NestedComponentProperty } from "./Component";

/**
 * Component data structure from API response
 */
export interface ComponentResponse {
  component: string;
  title: string;
  schema: JsonSchema | NestedComponentProperty;
  layout?: "vertical" | "horizontal";
}

/**
 * API response - list of component data (array of dictionaries)
 */
export type ApiResponse = ComponentResponse[];
