import { PanelData } from "./Panel";

export type ApiResponse = {
  [key: string]: {
    component_name: PanelData["component_name"];
    tile: PanelData["tile"];
    schema: PanelData["schema"];
    uiSchema: PanelData["uiSchema"];
  };
};
