import React, { useState, useEffect } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { isControl, rankWith } from "@jsonforms/core";
import { AADHAAR_REGEX } from "@/lib/jsonforms-ajv";

interface AadhaarRendererProps {
  data: string;
  path: string;
  handleChange(path: string, value: unknown): void;
}

const AadhaarRenderer = ({ data, path, handleChange }: AadhaarRendererProps) => {
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAadhaar(data || "");
  }, [data]);

  const validate = (v: string) => {
    const ok = AADHAAR_REGEX.test(v);
    setError(ok ? null : "Enter a valid 12-digit Aadhaar");
    return ok;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaar(v);
    handleChange(path, v);
    validate(v);
  };

  const onAuth = () => {
    if (validate(aadhaar)) {
      window.location.href = "https://myaadhaar.uidai.gov.in/verifyAadhaar";
    }
  };

  return (
    <TextField
      fullWidth
      label="Aadhaar"
      variant="outlined"
      value={aadhaar}
      onChange={onChange}
      inputProps={{ maxLength: 12, inputMode: "numeric" }}
      error={!!error}
      helperText={error || ""}
      InputProps={{
        endAdornment: AADHAAR_REGEX.test(aadhaar) ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={onAuth}
            sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
                width: 24,
                height: 24,
            }}
            
            >
              <CheckIcon />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  );
};

export default withJsonFormsControlProps(AadhaarRenderer);

export const aadhaarTester = rankWith(
  4,
  (uischema, _schema) =>
    isControl(uischema) &&
    uischema.scope.toLowerCase().includes("aadhaar")
);
