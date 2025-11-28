"use client";
import React, { useMemo } from "react";
import type { ReactElement } from "react";
import { JsonSchema } from "@jsonforms/core";
import {
  BaseComponentProps,
  ComponentRegistry,
  ComponentName,
  LayoutDirection,
  ComponentItem,
  isNestedComponentProperty,
  NestedComponentProperty,
  ComponentData
} from "../types/Component";
import DropDown from "./libComponents/DropDown";
import { LibComponentRegistry } from "../types/LibComponent";
import Radio from "./libComponents/Radio";

const libComponentRegistry: LibComponentRegistry = {
  DropDown,
  Radio
} as const;

export interface JsonSchemaComponentRenderProps<
  TComponentName extends ComponentName = ComponentName
> {
  readonly data: ComponentData[];
  readonly defaultLayout?: LayoutDirection;
  readonly componentRegistry: ComponentRegistry<TComponentName>;
  readonly className?: string;
  readonly itemClassName?: string;
}

function hasProperties(
  schema: unknown
): schema is JsonSchema & { properties: Record<string, unknown> } {
  return (
    typeof schema === "object" &&
    schema !== null &&
    "properties" in schema &&
    typeof (schema as { properties: unknown }).properties === "object" &&
    (schema as { properties: unknown }).properties !== null
  );
}

function cleanSchemaForJsonForms(
  schema: JsonSchema | NestedComponentProperty
): JsonSchema {
  if (!schema || typeof schema !== "object") {
    return schema as JsonSchema;
  }

  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key !== "component" ) {
      cleaned[key] = value;
    }
  }

  if (hasProperties(schema)) {
    const cleanedProperties: Record<string, JsonSchema> = {};

    for (const [key, property] of Object.entries(schema.properties)) {
      if (isNestedComponentProperty(property)) {
        cleanedProperties[key] = {
          type: "object",
          title: property.title,
        } as JsonSchema;
      } else {
        cleanedProperties[key] = cleanSchemaForJsonForms(property as JsonSchema);
      }
    }

    cleaned.properties = cleanedProperties;
  }

  return cleaned as JsonSchema;
}

export default function JsonSchemaComponentRender<
  TComponentName extends ComponentName = ComponentName
>({
  data,
  defaultLayout = "vertical",
  componentRegistry,
  className = "p-8",
  itemClassName = "p-4",
}: JsonSchemaComponentRenderProps<TComponentName>): ReactElement {
  
  const finalRenderList = useMemo(() => {
    const renderList: ComponentItem[] = [];
    const visited = new Set<string>();

    for (const item of data) {
      const rootUid = `root-${item.title}-${Date.now()}-${Math.random()}`;

      const rootComponent: ComponentItem = {
        component: item.component,          
        title: item.title,
        schema: item.schema,
        layout: item.layout ?? defaultLayout,
        originalSchema: item.originalSchema as JsonSchema | NestedComponentProperty | undefined,
        _uid: rootUid,
        _level: 0,
      };

      const queue: ComponentItem[] = [rootComponent];

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        if (visited.has(current._uid)) continue;
        visited.add(current._uid);

        const cleanedSchema = cleanSchemaForJsonForms(
          (current.originalSchema as JsonSchema | NestedComponentProperty) ||
            current.schema
        );
        current.schema = cleanedSchema;

        renderList.push(current);

        const originalSchema = (current.originalSchema as
          | JsonSchema
          | NestedComponentProperty
          | undefined) || current.schema;

        if (hasProperties(originalSchema)) {
          for (const [key, property] of Object.entries(originalSchema.properties)) {
            if (isNestedComponentProperty(property)) {
              const nestedComponentSchema = property.schema;
              const cleanedNestedSchema = cleanSchemaForJsonForms(
                nestedComponentSchema as JsonSchema | NestedComponentProperty
              );

              const nestedComponent: ComponentItem = {
                component: property.component,   // ⬅ changed here
                title: property.title ?? (nestedComponentSchema as JsonSchema)?.title ?? key,
                schema: cleanedNestedSchema,
                layout: property.layout ?? defaultLayout,
                originalSchema: nestedComponentSchema as JsonSchema | NestedComponentProperty,
                _uid: `${current._uid}.${key}`,
                _parentUid: current._uid,
                _level: current._level + 1,
              };

              if (!visited.has(nestedComponent._uid)) {
                queue.push(nestedComponent);
              }
            }
          }
        }
      }
    }

    return renderList;
  }, [data, defaultLayout]);

  const renderComponents = (items: readonly ComponentItem[]): ReactElement[] => {
    return items.map((item): ReactElement => {
      const componentName = item.component as TComponentName; // ⬅ changed
      const Component = componentRegistry[componentName];
      
      if (!Component) {
        console.warn(`Component ${item.component} not found in registry`);
        return (
          <div key={item._uid}>
            Component {item.component} not found
          </div>
        );
      }

      const componentProps: BaseComponentProps = {
        title: item.title,
        schema: item.schema,
        libComponentRegistry: libComponentRegistry,
      };

      return (
        <div key={item._uid} className={itemClassName}>
          {React.createElement(Component, componentProps)}
        </div>
      );
    });
  };

  return (
    <div className={className}>
      {renderComponents(finalRenderList)}
    </div>
  );
}
