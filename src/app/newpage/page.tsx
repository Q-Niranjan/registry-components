"use client";

export function OnePanelComponent1({ title, children }: any) {
    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <div>{children}</div>
        </div>
    );
}

export function DropDown1({ name, options = [] }: any) {
    return (
        <div className="mb-4">
            <label className="block font-medium capitalize mb-1">{name}</label>

            <select name={name} className="border rounded p-2 w-full bg-white">
                {options.map((o: string) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
        </div>
    );
}

export function Radio1({ name, options = [] }: any) {
    return (
        <div className="mb-4">
            <p className="font-medium capitalize mb-1">{name}</p>

            {options.map((opt: string) => (
                <label key={opt} className="mr-4">
                    <input type="radio" name={name} value={opt} className="mr-1" />
                    {opt}
                </label>
            ))}
        </div>
    );
}


export const componentRegistry: Record<string, React.FC<any>> = {
    OnePanelComponent1,
    DropDown1,
    Radio1
};

export function Renderer({ config }: { config: any }) {
    if (!config) return null;

    if (Array.isArray(config)) {
        return (
            <>
                {config.map((c, i) => (
                    <Renderer key={i} config={c} />
                ))}
            </>
        );
    }

    const Component = componentRegistry[config.component];
    if (!Component) {
        console.error("Unknown UI Component:", config.component);
        return null;
    }

    if (config.schema?.properties) {
        const fields = Object.entries(config.schema.properties);

        return (
            <Component {...config}>
                {fields.map(([key, field]: any) => (
                    <Renderer
                        key={key}
                        config={{
                            ...field,
                            name: key,
                            options: field.enum,
                        }}
                    />
                ))}
            </Component>
        );
    }

    const cleanedConfig = {
        ...config,
        options: config.enum,
    };
    delete cleanedConfig.enum;

    return <Component {...cleanedConfig} />;
}


const json = [
    {
        component: "OnePanelComponent1",
        title: "Labour Details",
        schema: {
            type: "object",
            properties: {
                shift: {
                    component: "DropDown1",
                    type: "string",
                    enum: ["Morning", "Evening", "Night"]
                },
                shiftType: {
                    component: "Radio1",
                    type: "string",
                    enum: ["Full Day", "Half Day", "Overtime"]
                }
            }
        }
    }
];

export default function ahah() {
    return (
        <div className="p-6">
            <Renderer config={json} />
        </div>
    );
}
