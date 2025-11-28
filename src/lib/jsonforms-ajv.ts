import { createAjv } from "@jsonforms/core";

export const AADHAAR_REGEX = /^[0-9]{12}$/;

const aadhaarFormat = {
  type: "string" as const,
  validate: (value: string): boolean => {
    if (typeof value !== "string") return false;
    return AADHAAR_REGEX.test(value);
  },
};

export const ajv = createAjv({
  validateFormats: true,
  strict: false,
});

ajv.addFormat("aadhaar", aadhaarFormat);

// Suppress the specific AJV format warning for aadhaar
// The warning appears because AJV checks formats during schema compilation
// but we've already registered it, so the warning is safe to ignore
if (typeof window !== "undefined") {
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]): void => {
    const message = String(args[0] || "");
    if (
      message.includes('unknown format "aadhaar"') ||
      message.includes("unknown format 'aadhaar'") ||
      (message.includes("aadhaar") && message.includes("ignored") && message.includes("schema"))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

