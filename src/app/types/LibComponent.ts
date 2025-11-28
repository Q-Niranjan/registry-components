
import { JsonSchema } from "@jsonforms/core";
import { ComponentType } from "react";

export interface LibBaseComponentProps {
  schema: JsonSchema;
}

export type ComponentName = string;


// Component Registry: Maps Component Name → React Component
export type LibComponentRegistry<T extends ComponentName = ComponentName> = Record<
  T,
  ComponentType<LibBaseComponentProps>
>;
