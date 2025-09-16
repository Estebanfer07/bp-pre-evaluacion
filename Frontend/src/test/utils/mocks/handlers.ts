import { rest } from "msw";
import {
  mockClients,
  mockClientListItems,
  getMockClientById,
  searchMockClients,
  mockAccountListItems,
  getMockAccountById,
  getMockAccountsByClientId,
  searchMockAccounts,
  mockMovementListItems,
  getMockMovementById,
  getMockMovementsByAccountId,
  searchMockMovements,
} from "./index";

const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const handlers = [
  // Clients endpoints
  rest.get(`${baseUrl}/clients`, (req, res, ctx) => {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");

    if (search) {
      return res(ctx.json(searchMockClients(search)));
    }

    return res(ctx.json(mockClientListItems));
  }),

  rest.get(`${baseUrl}/clients/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const client = getMockClientById(id as string);

    if (!client) {
      return res(ctx.status(404), ctx.json({ message: "Client not found" }));
    }

    return res(ctx.json(client));
  }),

  rest.post(`${baseUrl}/clients`, async (req, res, ctx) => {
    const clientData = await req.json();

    // Simulate client creation
    const newClient = {
      id: `client-${Date.now()}`,
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.status(201), ctx.json(newClient));
  }),

  rest.put(`${baseUrl}/clients/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const client = getMockClientById(id as string);

    if (!client) {
      return res(ctx.status(404), ctx.json({ message: "Client not found" }));
    }

    const updateData = await req.json();
    const updatedClient = {
      ...client,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.json(updatedClient));
  }),

  rest.delete(`${baseUrl}/clients/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const client = getMockClientById(id as string);

    if (!client) {
      return res(ctx.status(404), ctx.json({ message: "Client not found" }));
    }

    return res(ctx.status(204));
  }),

  // Accounts endpoints
  rest.get(`${baseUrl}/accounts`, (req, res, ctx) => {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const clientId = url.searchParams.get("clientId");

    let accounts = mockAccountListItems;

    if (clientId) {
      const clientAccounts = getMockAccountsByClientId(clientId);
      accounts = clientAccounts.map((acc) => ({
        ...acc,
        clientName: mockClients.find((c) => c.id === acc.clientId)?.person.name,
      })) as typeof mockAccountListItems;
    }

    if (search) {
      accounts = searchMockAccounts(search);
    }

    return res(ctx.json(accounts));
  }),

  rest.get(`${baseUrl}/accounts/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const account = getMockAccountById(id as string);

    if (!account) {
      return res(ctx.status(404), ctx.json({ message: "Account not found" }));
    }

    return res(ctx.json(account));
  }),

  rest.post(`${baseUrl}/accounts`, async (req, res, ctx) => {
    const accountData = await req.json();

    // Simulate account creation
    const newAccount = {
      id: `account-${Date.now()}`,
      accountNumber: `${Math.random().toString().substr(2, 10)}`,
      ...accountData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.status(201), ctx.json(newAccount));
  }),

  rest.put(`${baseUrl}/accounts/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const account = getMockAccountById(id as string);

    if (!account) {
      return res(ctx.status(404), ctx.json({ message: "Account not found" }));
    }

    const updateData = await req.json();
    const updatedAccount = {
      ...account,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.json(updatedAccount));
  }),

  rest.delete(`${baseUrl}/accounts/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const account = getMockAccountById(id as string);

    if (!account) {
      return res(ctx.status(404), ctx.json({ message: "Account not found" }));
    }

    return res(ctx.status(204));
  }),

  // Movements endpoints
  rest.get(`${baseUrl}/movements`, (req, res, ctx) => {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const accountId = url.searchParams.get("accountId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let movements = mockMovementListItems;

    if (accountId) {
      const accountMovements = getMockMovementsByAccountId(accountId);
      movements = accountMovements.map((mov) => {
        const account = getMockAccountById(mov.accountId);
        const client = mockClients.find((c) => c.id === account?.clientId);
        return {
          ...mov,
          accountNumber: account?.accountNumber,
          clientName: client?.person.name,
        };
      }) as typeof mockMovementListItems;
    }

    if (startDate && endDate) {
      movements = movements.filter(
        (mov) => mov.date >= startDate && mov.date <= endDate
      );
    }

    if (search) {
      movements = searchMockMovements(search);
    }

    return res(ctx.json(movements));
  }),

  rest.get(`${baseUrl}/movements/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const movement = getMockMovementById(id as string);

    if (!movement) {
      return res(ctx.status(404), ctx.json({ message: "Movement not found" }));
    }

    return res(ctx.json(movement));
  }),

  rest.post(`${baseUrl}/movements`, async (req, res, ctx) => {
    const movementData = await req.json();

    // Simulate movement creation
    const newMovement = {
      id: `movement-${Date.now()}`,
      ...movementData,
      date: new Date().toISOString(),
      isReversed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.status(201), ctx.json(newMovement));
  }),

  rest.put(`${baseUrl}/movements/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const movement = getMockMovementById(id as string);

    if (!movement) {
      return res(ctx.status(404), ctx.json({ message: "Movement not found" }));
    }

    const updateData = await req.json();
    const updatedMovement = {
      ...movement,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.json(updatedMovement));
  }),

  rest.delete(`${baseUrl}/movements/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const movement = getMockMovementById(id as string);

    if (!movement) {
      return res(ctx.status(404), ctx.json({ message: "Movement not found" }));
    }

    return res(ctx.status(204));
  }),

  // Reports endpoint
  rest.post(`${baseUrl}/reports/movements`, async (req, res, ctx) => {
    const reportData = await req.json();

    // Simulate report generation
    return res(
      ctx.json({
        message: "Report generated successfully",
        reportId: `report-${Date.now()}`,
        format: reportData.format || "PDF",
        generatedAt: new Date().toISOString(),
      })
    );
  }),
];
