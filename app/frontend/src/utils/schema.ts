export const REQUIRED_FIELDS = [
  { key: "case_id", label: "Case ID (required)" },
  { key: "applicant_name", label: "Applicant Name (required)" },
  { key: "dob", label: "Date of Birth (required)" },
];

export const OPTIONAL_FIELDS = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "category", label: "Category" },
  { key: "priority", label: "Priority" },
];

export const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];
