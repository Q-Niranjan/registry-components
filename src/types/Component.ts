import { JsonSchema, } from "@jsonforms/core";
import { ComponentType } from "react";
import { LibComponentRegistry } from "./LibComponent";

// Base Props for All Components
export interface BaseComponentProps {
  title: string;
  schema: JsonSchema;
  libComponentRegistry: LibComponentRegistry;
  onEdit?: () => void;
}

// Global Types
export type LayoutDirection = "vertical" | "horizontal";
export type ComponentName = string;

// Nested Component Property (Used Inside JSON Schema)
export interface NestedComponentProperty {
  type: "object";
  title?: string;
  component: ComponentName;
  schema: JsonSchema | NestedComponentProperty;
  layout?: LayoutDirection;
  properties?: Record<string, JsonSchema | NestedComponentProperty>;
}

// Type Guard: Detect Nested Component Property
export function isNestedComponentProperty(
  property: unknown
): property is NestedComponentProperty {
  return (
    typeof property === "object" &&
    property !== null &&
    "component" in property &&
    "schema" in property &&
    typeof (property as NestedComponentProperty).component === "string" &&
    typeof (property as NestedComponentProperty).schema === "object" &&
    (property as NestedComponentProperty).schema !== null &&
    "type" in ((property as NestedComponentProperty).schema as object)
  );
}

// Component Registry: Maps Component Name → React Component
export type ComponentRegistry<T extends ComponentName = ComponentName> = Record<
  T,
  ComponentType<BaseComponentProps>
>;

// Internal Representation for Render Queue
export interface ComponentItem {
  readonly component: ComponentName;
  readonly title: string;
  schema: JsonSchema;
  readonly layout?: LayoutDirection;
  readonly originalSchema?: JsonSchema | NestedComponentProperty;

  readonly _uid: string;
  readonly _parentUid?: string;
  readonly _level: number;      // Nesting depth
}

//Data Format Received from Backend (FastAPI)
export interface ComponentData {
  readonly component: ComponentName;
  readonly title: string;
  schema: JsonSchema;
  readonly layout?: LayoutDirection;
  readonly originalSchema?: JsonSchema | unknown;
}
