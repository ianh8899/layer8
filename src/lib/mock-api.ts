import {
  integrations,
  integrationTypes,
  type I_Integration,
  type I_IntegrationType,
  type T_IntegrationStatus,
} from "./db";

export const getIntegrations = async (): Promise<I_Integration[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return integrations;
};

export const addIntegration = async (integration: I_Integration) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  integrations.push(integration);
  return "Integration added successfully";
};

export const addNewIntegrationType = async (type: I_IntegrationType) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  integrationTypes.push(type);
  return "Integration type added successfully";
};

export const updateStatus = async (id: string, status: T_IntegrationStatus) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  for (const integration of integrations) {
    if (integration.id === id) {
      integration.status = status;
      return `Integration ${id} status updated to ${status}`;
    }
  }
  return `Couldn't update status: Integration ${id} not found`;
};

export const manualSync = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 1 in 3 chance of error (33.33% chance)
  const randomisedError = Math.random() < 1 / 3;

  for (const integration of integrations) {
    if (integration.id === id) {
      if (randomisedError) {
        integration.errorCount += 1;
        integration.status = "error";
        return `Manual sync failed for integration ${id} due to an error`;
      } else {
        integration.lastSync = new Date().toISOString();
        integration.status = "active";
        return `Manual sync completed successfully for integration ${id}`;
      }
    }
  }
  return `Couldn't initiate manual sync: Integration ${id} not found`;
};
