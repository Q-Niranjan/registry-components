"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ComponentData } from "../types/Component";
import { ApiResponse } from "../types/ApiResponse";

interface DataContextType {
    data: ComponentData[];
    isLoading: boolean;
    error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ComponentData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData(): Promise<void> {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch("/api/data");

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const json: ApiResponse = await response.json();

                const componentData: ComponentData[] = json.map(item => ({
                    component: item.component,
                    title: item.title,
                    originalSchema: item.schema,
                    schema: item.schema as ComponentData["schema"],
                    layout: item.layout ?? "vertical",
                }));

                if (isMounted) {
                    setData(componentData);
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Unknown error occurred";
                if (isMounted) {
                    setError(errorMessage);
                }
                console.error("Error fetching data:", err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <DataContext.Provider value={{ data, isLoading, error }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
