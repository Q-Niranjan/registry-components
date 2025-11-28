"use client";

import React from "react";
import type { BaseComponentProps } from "../types/Component";
import { libComponentRender } from "./libComponents/libComponentRender";

const OnePanelComponent: React.FC<BaseComponentProps> = ({
  title,
  schema,
  libComponentRegistry
}) => {  
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {libComponentRender({ schema, libComponentRegistry })}
    </div>
  );
};

export default OnePanelComponent;
