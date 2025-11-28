# JSON Forms: Features Lost Without uiSchema

## Overview
When using **@jsonforms/react** with only JSON Schema (without uiSchema), you lose significant control over form rendering, organization, and user experience. This document outlines what you cannot do and includes practical examples.

---

## 1. **Field Organization & Categorization**

### What You Lose
Without uiSchema, all fields render in a flat, unorganized list. You cannot group related fields into logical sections or tabs.

### Example Without uiSchema
```javascript
// Only JSON Schema provided
const schema = {
  type: "object",
  properties: {
    labourName: { type: "string", title: "Labour Name" },
    labourId: { type: "number", title: "Labour ID" },
    workType: { type: "string", title: "Type of Work" },
    dailyWage: { type: "number", title: "Daily Wage" },
    contractId: { type: "string", title: "Contract ID" }
  }
};

// Result: All 5 fields displayed in random/default order
// No grouping, no sections, no tabs
```

### Example With uiSchema
```javascript
const uiSchema = {
  type: "Categorization",
  elements: [
    {
      type: "Category",
      label: "Labour Basic Details",
      elements: [
        { type: "Control", scope: "#/properties/labourName" },
        { type: "Control", scope: "#/properties/labourId" }
      ]
    },
    {
      type: "Category",
      label: "Work Information",
      elements: [
        { type: "Control", scope: "#/properties/workType" },
        { type: "Control", scope: "#/properties/dailyWage" }
      ]
    }
  ]
};

// Result: Fields organized into two separate sections/tabs
```

---

## 2. **Control Widget Selection**

### What You Lose
Without uiSchema, JSON Forms uses default renderers. You cannot specify which widget to use for each field (text, number, select, textarea, date picker, radio, checkbox, etc.).

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    paymentMode: {
      type: "string",
      enum: ["Cash", "Bank Transfer", "UPI"],
      title: "Payment Mode"
    }
  }
};

// Result: Renders as a basic dropdown with default styling
// You have no control over appearance or widget type
```

### Example With uiSchema
```javascript
const uiSchema = {
  properties: {
    paymentMode: {
      type: "Control",
      scope: "#/properties/paymentMode",
      options: { widget: "radio" }  // Could also be "select", "checkbox", etc.
    }
  }
};

// Result: Renders as radio buttons instead of dropdown
```

---

## 3. **Field Visibility & Conditional Rendering**

### What You Lose
Without uiSchema, you cannot hide/show fields conditionally based on other field values or hide fields entirely from the form.

### Example Without uiSchema
```javascript
// Both fields always visible
const schema = {
  properties: {
    labourStatus: { type: "string", enum: ["Active", "Inactive"] },
    trainingDates: { type: "string", format: "date" }
  }
};

// Result: trainingDates appears even when labourStatus is not relevant
```

### Example With uiSchema
```javascript
const uiSchema = {
  scope: "#/properties/trainingDates",
  type: "Control",
  rule: {
    effect: "HIDE",
    condition: {
      scope: "#/properties/labourStatus",
      schema: { const: "Active" }
    }
  }
};

// Result: trainingDates only shown when labourStatus = "Active"
```

---

## 4. **Nested Object Layout Control**

### What You Lose
Without uiSchema, nested objects (like `workDetails` containing `contractInfo`) render in default nested structures. You cannot control how deeply nested objects are presented (side-by-side, vertically, collapsed, etc.).

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    workDetails: {
      type: "object",
      properties: {
        workType: { type: "string" },
        contractInfo: {
          type: "object",
          properties: {
            contractId: { type: "string" },
            contractAmount: { type: "number" }
          }
        }
      }
    }
  }
};

// Result: Deeply nested structure, hard to navigate
// No control over layout or presentation
```

### Example With uiSchema
```javascript
const uiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        { type: "Control", scope: "#/properties/workDetails/properties/workType" },
        { type: "Control", scope: "#/properties/workDetails/properties/contractInfo/properties/contractAmount" }
      ]
    }
  ]
};

// Result: workType and contractAmount displayed side-by-side
```

---

## 5. **Control Options & Placeholder Text**

### What You Lose
Without uiSchema, you cannot specify placeholder text, help text, or other rendering options for input fields.

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    labourName: { type: "string", title: "Labour Name" }
  }
};

// Result: Input field with no placeholder guidance
```

### Example With uiSchema
```javascript
const uiSchema = {
  scope: "#/properties/labourName",
  type: "Control",
  options: {
    placeholder: "Enter full name (e.g., John Doe)",
    help: "First and last name as per Aadhaar"
  }
};

// Result: Field has helpful placeholder and help text
```

---

## 6. **Styling & Custom CSS Classes**

### What You Lose
Without uiSchema, you cannot apply custom styling, CSS classes, or Material-UI classes to specific fields or sections.

### Example Without uiSchema
```javascript
// No way to apply custom styles per field
const schema = {
  properties: {
    urgentNote: { type: "string" }
  }
};
```

### Example With uiSchema
```javascript
const uiSchema = {
  scope: "#/properties/urgentNote",
  type: "Control",
  options: {
    classNames: "highlight-red",
    variant: "outlined"
  }
};

// Result: Field can have custom styling or Material-UI variants
```

---

## 7. **Horizontal vs Vertical Layout Control**

### What You Lose
Without uiSchema, all fields stack vertically by default. You cannot arrange fields horizontally on the same row.

### Example Without uiSchema
```javascript
// Fields always stack vertically
const schema = {
  properties: {
    labourId: { type: "number" },
    aadhaar: { type: "string" },
    shift: { type: "string" }
  }
};

// Result:
// labourId
// aadhaar
// shift
```

### Example With uiSchema
```javascript
const uiSchema = {
  type: "HorizontalLayout",
  elements: [
    { type: "Control", scope: "#/properties/labourId" },
    { type: "Control", scope: "#/properties/aadhaar" },
    { type: "Control", scope: "#/properties/shift" }
  ]
};

// Result: All three fields displayed in a single row
```

---

## 8. **Field Ordering**

### What You Lose
Without uiSchema, field order depends on JSON Schema property order, which may not be intuitive for users.

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    contractId: { type: "string" },
    labourName: { type: "string" },
    dailyWage: { type: "number" }
  }
};

// Result: Fields appear in whatever order they're defined in schema
// User cannot reorder them logically
```

### Example With uiSchema
```javascript
const uiSchema = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/labourName" },
    { type: "Control", scope: "#/properties/dailyWage" },
    { type: "Control", scope: "#/properties/contractId" }
  ]
};

// Result: Fields displayed in logical order regardless of schema order
```

---

## 9. **Expandable/Collapsible Sections**

### What You Lose
Without uiSchema, you cannot create collapsible sections or accordions for better space usage and organization.

### Example Without uiSchema
```javascript
// Everything always visible
const schema = {
  properties: {
    basicInfo: { /* ... */ },
    workDetails: { /* ... */ },
    contractInfo: { /* ... */ }
  }
};
```

### Example With uiSchema
```javascript
const uiSchema = {
  type: "Categorization",
  elements: [
    {
      type: "Category",
      label: "Basic Info",
      elements: [ /* ... */ ]
    },
    {
      type: "Category",
      label: "Work Details (Click to expand)",
      elements: [ /* ... */ ]
    }
  ]
};

// Result: Sections can be expanded/collapsed like an accordion
```

---

## 10. **Validation Message Customization**

### What You Lose
Without uiSchema, error messages are generic and cannot be customized or positioned specifically.

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    dailyWage: { type: "number", minimum: 100 }
  }
};

// Result: Generic error "must be >= 100"
```

### Example With uiSchema
```javascript
const uiSchema = {
  scope: "#/properties/dailyWage",
  type: "Control",
  options: {
    errorMessages: {
      minimum: "Daily wage must be at least ₹100"
    }
  }
};

// Result: Custom, user-friendly error message
```

---

## 11. **Read-Only Fields**

### What You Lose
Without uiSchema, you cannot mark fields as read-only even in JSON Schema.

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    labourId: { type: "number", title: "Labour ID" }
  }
};

// Result: labourId is fully editable
```

### Example With uiSchema
```javascript
const uiSchema = {
  scope: "#/properties/labourId",
  type: "Control",
  options: { readonly: true }
};

// Result: labourId appears but cannot be edited
```

---

## 12. **Multi-Select vs Single Select**

### What You Lose
Without uiSchema, enum fields render as single-select only. You cannot create multi-select lists.

### Example Without uiSchema
```javascript
const schema = {
  properties: {
    shifts: { 
      type: "string", 
      enum: ["Morning", "Evening", "Night"]
    }
  }
};

// Result: Single dropdown, can only pick one shift
```

### Example With uiSchema
```javascript
const uiSchema = {
  scope: "#/properties/shifts",
  type: "Control",
  options: { format: "checkbox" }
};

// Result: Checkboxes, user can select multiple shifts
```

---

## Summary Table

| Feature | Without uiSchema | With uiSchema |
|---------|-----------------|---------------|
| Field Grouping | ❌ Flat list | ✅ Organized categories |
| Widget Control | ❌ Default only | ✅ Choose any widget |
| Visibility Rules | ❌ All visible | ✅ Conditional hide/show |
| Layout Control | ❌ Vertical only | ✅ Horizontal/Vertical mix |
| Field Ordering | ❌ Schema order | ✅ Custom order |
| Styling | ❌ Default styling | ✅ Custom classes & variants |
| Read-Only Fields | ❌ Not possible | ✅ Supported |
| Collapsible Sections | ❌ No | ✅ Yes (Accordion) |
| Error Messages | ❌ Generic | ✅ Customized |
| Placeholders | ❌ None | ✅ Custom text |
| Multi-Select | ❌ No | ✅ Yes |

---
