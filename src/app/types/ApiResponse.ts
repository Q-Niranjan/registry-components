import { PanelData } from "./Panel";

export type ApiResponse = {
  [key: string]: {
    panelTitle: string;
    panelType: PanelData["panelType"];
    schema: PanelData["schema"];
    uiSchema: PanelData["uiSchema"];
  };
};
