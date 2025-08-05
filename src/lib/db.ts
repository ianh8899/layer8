// Interface for integration types
export interface I_IntegrationType {
  id: string;
  name: string;
  description: string;
  category: string;
  supportedSystems: string[];
  dataModels: DataModelName[];
}

export const integrationTypes: I_IntegrationType[] = [
  {
    id: "crm",
    name: "CRM Integration",
    description: "Sync customer data with CRM systems",
    category: "Customer Management",
    supportedSystems: ["Salesforce", "HubSpot"],
    dataModels: ["customers", "tenancies"],
  },
  {
    id: "workplace",
    name: "Workplace Management",
    description: "Sync building and room data with workplace platforms",
    category: "Space Management",
    supportedSystems: ["Nexudus", "OfficeRND"],
    dataModels: ["buildings", "rooms", "tenancies"],
  },
  {
    id: "ticketing",
    name: "Support Ticketing",
    description: "Sync support tickets with external platforms",
    category: "Support",
    supportedSystems: ["Zendesk", "ServiceNow", "Freshdesk"],
    dataModels: ["tickets", "customers"],
  },
];

// Export options for new integration creation
export const INTEGRATION_STATUSES = [
  "active",
  "inactive",
  "error",
  "pending",
] as const;

export const STATUS = {
  ACTIVE: INTEGRATION_STATUSES[0],
  INACTIVE: INTEGRATION_STATUSES[1],
  ERROR: INTEGRATION_STATUSES[2],
  PENDING: INTEGRATION_STATUSES[3],
} as const;

export const SYNC_DIRECTIONS = [
  "bidirectional",
  "layer8-to-external",
  "external-to-layer8",
] as const;
export const SYNC_FREQUENCIES = [
  "real-time",
  "hourly",
  "daily",
  "weekly",
  "monthly",
] as const;
export const AUTH_TYPES = ["oauth", "api-key"] as const;

// Interface for integrations
export type T_IntegrationStatus = (typeof INTEGRATION_STATUSES)[number];
export type T_SyncDirection = (typeof SYNC_DIRECTIONS)[number];
export type T_AuthType = (typeof AUTH_TYPES)[number];
export type T_SyncFrequency = (typeof SYNC_FREQUENCIES)[number];

export type T_IntegrationConfiguration = {
  endpoint: string;
  authType: T_AuthType;
  dataMapping: Partial<Record<DataModelName, string>>;
};

export interface I_Integration {
  id: string;
  name: string;
  type: string;
  system: string;
  status: T_IntegrationStatus;
  lastSync: string;
  syncFrequency: T_SyncFrequency;
  syncDirection: T_SyncDirection;
  recordsCount: number;
  errorCount: number;
  configuration: T_IntegrationConfiguration;
}

export const integrations: I_Integration[] = [
  {
    id: "int-001",
    name: "Salesforce CRM",
    type: "crm",
    system: "Salesforce",
    status: "active",
    lastSync: "2024-01-15T10:30:00Z",
    syncFrequency: "hourly",
    syncDirection: "bidirectional",
    recordsCount: 1250,
    errorCount: 0,
    configuration: {
      endpoint: "https://company.salesforce.com",
      authType: "oauth",
      dataMapping: {
        customers: "Account",
        tenancies: "Opportunity",
      },
    },
  },
  {
    id: "int-002",
    name: "Zendesk Support",
    type: "ticketing",
    system: "Zendesk",
    status: "active",
    lastSync: "2024-01-15T11:15:00Z",
    syncFrequency: "real-time",
    syncDirection: "bidirectional",
    recordsCount: 89,
    errorCount: 2,
    configuration: {
      endpoint: "https://company.zendesk.com",
      authType: "api-key",
      dataMapping: {
        tickets: "Ticket",
        customers: "User",
      },
    },
  },
  {
    id: "int-003",
    name: "My Nexudus Instance",
    type: "workplace",
    system: "Nexudus",
    status: "error",
    lastSync: "2024-01-15T08:45:00Z",
    syncFrequency: "daily",
    syncDirection: "layer8-to-external",
    recordsCount: 45,
    errorCount: 5,
    configuration: {
      endpoint: "https://company.nexudus.com",
      authType: "oauth",
      dataMapping: {
        buildings: "Location",
        rooms: "Space",
        tenancies: "Booking",
      },
    },
  },
];

// Interface for data models
export type T_FieldType = "string" | "number" | "date" | "enum";

export type T_DataModelField = {
  name: string;
  type: T_FieldType;
  required: boolean;
  options?: string[];
};

export interface I_DataModel {
  name: string;
  displayName: string;
  fields: T_DataModelField[];
}

// Extracted union type for data model names
export type DataModelName = (typeof dataModels)[number]["name"];

export const dataModels = [
  {
    name: "customers",
    displayName: "Customers",
    fields: [
      { name: "customer_id", type: "number", required: true },
      { name: "account_number", type: "string", required: true },
      { name: "company_name", type: "string", required: true },
      { name: "email", type: "string", required: true },
      { name: "phone", type: "string", required: false },
      { name: "address", type: "string", required: false },
    ],
  },
  {
    name: "buildings",
    displayName: "Buildings",
    fields: [
      { name: "building_id", type: "number", required: true },
      { name: "building_name", type: "string", required: true },
      { name: "building_code", type: "string", required: true },
      { name: "address_1", type: "string", required: false },
      { name: "postcode", type: "string", required: false },
    ],
  },
  {
    name: "rooms",
    displayName: "Rooms",
    fields: [
      { name: "room_id", type: "number", required: true },
      { name: "building_id", type: "number", required: true },
      { name: "room_number", type: "string", required: true },
      { name: "area_squarefeet", type: "number", required: false },
    ],
  },
  {
    name: "tenancies",
    displayName: "Tenancies",
    fields: [
      { name: "tenancy_id", type: "number", required: true },
      { name: "room_id", type: "number", required: true },
      { name: "account_number", type: "string", required: true },
      { name: "start_date", type: "date", required: true },
      { name: "end_date", type: "date", required: false },
    ],
  },
  {
    name: "tickets",
    displayName: "Support Tickets",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "customer_id", type: "number", required: true },
      { name: "title", type: "string", required: true },
      { name: "description", type: "string", required: true },
      {
        name: "priority",
        type: "enum",
        required: true,
        options: ["low", "medium", "high", "critical"],
      },
      {
        name: "status",
        type: "enum",
        required: true,
        options: ["open", "in_progress", "resolved", "closed"],
      },
    ],
  },
] as const satisfies readonly I_DataModel[];

export const DATA_MODEL_NAMES = dataModels.map(
  (model) => model.name
) as DataModelName[];
