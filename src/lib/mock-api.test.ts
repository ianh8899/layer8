import type { I_Integration } from "./db";
import {
  addIntegration,
  getIntegrations,
  manualSync,
  updateIntegration,
  updateStatus,
} from "./mock-api";

describe("getIntegrations", () => {
  it("should return integrations array", async () => {
    const integrations = await getIntegrations();
    expect(Array.isArray(integrations)).toBe(true);
    expect(integrations.length).toBeGreaterThan(0);
  });
});

describe("addIntegration", () => {
  it("should add a new integration", async () => {
    const integrations = await getIntegrations();
    const newIntegration = {
      id: "int-1754478719101",
      name: "New Integration",
      type: "ticketing",
      system: "Freshdesk",
      status: "active",
      lastSync: "2025-08-06T11:11:59.101Z",
      syncFrequency: "monthly",
      syncDirection: "bidirectional",
      recordsCount: 0,
      errorCount: 0,
      configuration: {
        endpoint: "https://freshdesl.com",
        authType: "api-key",
        dataMapping: {
          tickets: "Ticket",
        },
      },
    } as I_Integration;

    const result = await addIntegration(newIntegration);
    expect(result).toBe("Integration added successfully");
    expect(integrations.length).toBe(4);
  });
});

describe("updateIntegration", () => {
  it("should update an existing integration", async () => {
    const integrations = await getIntegrations();
    const integrationToUpdate = integrations[0];
    const updatedIntegration = {
      ...integrationToUpdate,
      name: "Updated Integration Name",
    };

    const result = await updateIntegration(updatedIntegration);
    expect(result).toBe("Integration updated successfully");
  });

  it("should return error for non-existent integration", async () => {
    const nonExistentIntegration = {
      id: "",
      name: "New Integration",
      type: "ticketing",
      system: "Freshdesk",
      status: "active",
      lastSync: "2025-08-06T11:11:59.101Z",
      syncFrequency: "monthly",
      syncDirection: "bidirectional",
      recordsCount: 0,
      errorCount: 0,
      configuration: {
        endpoint: "https://freshdesl.com",
        authType: "api-key",
        dataMapping: {
          tickets: "Ticket",
        },
      },
    } as I_Integration;

    const result = await updateIntegration(nonExistentIntegration);
    expect(result).toBe(
      `Couldn't update integration: Integration ${nonExistentIntegration.id} not found`
    );
  });
});

describe("updateStatus", () => {
  it("should update integration status", async () => {
    const integrations = await getIntegrations();
    const errorStatusIntegration = integrations[2];
    const id = errorStatusIntegration.id;
    expect(errorStatusIntegration.status).toBe("error");

    const result = await updateStatus(id, "active");
    expect(result).toBe(`Integration ${id} status updated to active`);
    expect(errorStatusIntegration.status).toBe("active");
  });

  it("should return error for non-existent integration", async () => {
    const id = "";
    const result = await updateStatus(id, "active");
    expect(result).toBe(`Couldn't update status: Integration ${id} not found`);
  });
});

describe("manualSync", () => {
  it("should perform manual sync and return success message", async () => {
    const integrations = await getIntegrations();
    const firstIntegration = integrations[0];
    const id = firstIntegration.id;

    const result = await manualSync(firstIntegration.id);
    expect([
      `Manual sync completed successfully for integration ${id}`,
      `Manual sync failed for integration ${id} due to an error`,
    ]).toContain(result);
  });

  it("should handle manual sync for missing integration", async () => {
    const id = "";
    const result = await manualSync(id);

    expect(result).toBe(
      `Couldn't initiate manual sync: Integration ${id} not found`
    );
  });
});
