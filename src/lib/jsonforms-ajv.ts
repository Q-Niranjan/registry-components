import {createAjv } from "@jsonforms/core";

export const ajv = createAjv();

ajv.addFormat("aadhaar", {
  type: "string",
  validate: (value) => {
	if (typeof value !== "string") return false;
	return /^[0-9]{12}$/.test(value);
  }
});
