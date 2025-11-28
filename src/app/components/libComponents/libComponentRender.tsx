import type { JsonSchema } from "@jsonforms/core";
import type { LibComponentRegistry } from "@/app/types/LibComponent";

export function libComponentRender({
  schema,
  libComponentRegistry
}: {
  schema: JsonSchema;
  libComponentRegistry: LibComponentRegistry;
}) {
  return Object.entries(schema.properties || {}).map(([key, fieldSchema]: any) => {

    // Only fields with a component_name should be rendered
    if (!fieldSchema.component_level2) return null;

    const componentName = fieldSchema.component_level2;

    // Get component from registry
    const LibComponent = libComponentRegistry[componentName];

    if (!LibComponent) {
      return (
        <div key={key} className="text-red-500">
          Unknown lib component: {componentName}
        </div>
      );
    }

    const { component_level2, ...cleanedFieldSchema } = fieldSchema;

    const extractedSchema: JsonSchema = {
      type: "object",
      properties: { [key]: cleanedFieldSchema }
    };

    console.log("final schema ",extractedSchema);
    

    return (
      <div key={key} className="mb-4">
        <LibComponent schema={extractedSchema} />
      </div>
    );
  });
}
