"use client";

import type { ReactElement } from "react";
import JsonSchemaComponentRender from "../../components/JsonSchemaComponentRender";
import { ComponentRegistry } from "../../types/Component";
import OnePanelComponent from "../../components/OnePanelComponent";
import TwoPanelComponent from "../../components/TwoPanelComponent";
import { useData } from "../../contexts/DataContext";

const componentRegistry: ComponentRegistry = {
    OnePanelComponent,
    TwoPanelComponent
} as const;

export default function OneTwoPanelPage(): ReactElement {
    const { data: allData, isLoading, error } = useData();

    const onePanelData = allData.filter(item => item.component === "OnePanelComponent");
    const twoPanelData = allData.filter(item => item.component === "TwoPanelComponent");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-10">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-10">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <section>
                <h1 className="text-2xl font-bold mb-4">One Panel Section</h1>
                <p className="mb-4 text-gray-600">This section displays the One Panel Component with 3 attributes.</p>
                <JsonSchemaComponentRender
                    data={onePanelData}
                    defaultLayout="vertical"
                    componentRegistry={componentRegistry}
                />
            </section>

            <hr className="my-8 border-gray-200" />

            <section>
                <h1 className="text-2xl font-bold mb-4">Two Panel Section</h1>
                <p className="mb-4 text-gray-600">This section displays the Two Panel Component with 6 attributes.</p>
                <JsonSchemaComponentRender
                    data={twoPanelData}
                    defaultLayout="vertical"
                    componentRegistry={componentRegistry}
                />
            </section>
        </div>
    );
}
