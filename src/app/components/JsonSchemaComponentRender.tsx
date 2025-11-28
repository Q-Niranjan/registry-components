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

/**
 * Clean schema by removing component metadata from properties
 * This ensures the schema is valid for JsonForms
 */
function cleanSchemaForJsonForms(
  schema: JsonSchema | NestedComponentProperty
): JsonSchema {
  if (!schema || typeof schema !== "object") {
    return schema as JsonSchema;
  }

  // Create a new object without component metadata
  const cleaned: Record<string, unknown> = {};
  
  // Copy all properties except component metadata
  for (const [key, value] of Object.entries(schema)) {
    if (key !== "component_name" && key !== "uischema" && key !== "uiSchema") {
      cleaned[key] = value;
    }
  }

  // Clean properties if they exist
  if (hasProperties(schema)) {
    const cleanedProperties: Record<string, JsonSchema> = {};
    
    for (const [key, property] of Object.entries(schema.properties)) {
      if (isNestedComponentProperty(property)) {
        // If it's a nested component, replace it with just the type: "object"
        cleanedProperties[key] = {
          type: "object",
          title: property.title,
        } as JsonSchema;
      } else {
        // Recursively clean nested properties
        cleanedProperties[key] = cleanSchemaForJsonForms(property as JsonSchema);
      }
    }
    
    cleaned.properties = cleanedProperties as unknown as Record<string, JsonSchema>;
  }

  return cleaned as JsonSchema;
}

/**
 * Generic component renderer that can render any type of component
 * based on the provided component registry
 */
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
      // Create root unique key
      const rootUid = `root-${item.title}-${Date.now()}-${Math.random()}`;
      const rootComponent: ComponentItem = {
        component_name: item.component_name,
        title: item.title,
        schema: item.schema,
        uiSchema: item.uiSchema,
        layout: item.layout ?? defaultLayout,
        originalSchema: item.originalSchema as JsonSchema | NestedComponentProperty | undefined,
        _uid: rootUid,
        _level: 0,
      };

      const queue: ComponentItem[] = [rootComponent];

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        // Skip duplicates
        if (visited.has(current._uid)) continue;
        visited.add(current._uid);

        // Clean the schema for JsonForms (remove component metadata from properties)
        const cleanedSchema = cleanSchemaForJsonForms(
          (current.originalSchema as JsonSchema | NestedComponentProperty) ||
            current.schema
        );
        current.schema = cleanedSchema;

        // Add current component to render list
        renderList.push(current);

        // Extract nested components from schema properties
        const originalSchema = (current.originalSchema as
          | JsonSchema
          | NestedComponentProperty
          | undefined) || current.schema;

        if (hasProperties(originalSchema)) {
          for (const [key, property] of Object.entries(originalSchema.properties)) {
            if (isNestedComponentProperty(property)) {
              // Extract the nested component's schema
              const nestedComponentSchema = property.schema;
              const cleanedNestedSchema = cleanSchemaForJsonForms(
                nestedComponentSchema as JsonSchema | NestedComponentProperty
              );

              const nestedComponent: ComponentItem = {
                component_name: property.component_name,
                title: property.title ?? (nestedComponentSchema as JsonSchema)?.title ?? key,
                schema: cleanedNestedSchema,
                uiSchema: property.uiSchema,
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
      const componentName = item.component_name as TComponentName;
      const Component = componentRegistry[componentName];
      
      if (!Component) {
        console.warn(`Component ${item.component_name} not found in registry`);
        return (
          <div key={item._uid}>
            Component {item.component_name} not found
          </div>
        );
      }

      const componentProps: BaseComponentProps = {
        title: item.title,
        schema: item.schema,
        uiSchema: item.uiSchema,
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
