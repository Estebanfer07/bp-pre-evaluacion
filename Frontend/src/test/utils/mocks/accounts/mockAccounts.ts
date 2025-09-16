import type { Account, AccountListItem } from "../../../../types/accounts";

export const mockAccounts: Account[] = [
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440001",
    accountNumber: "0012345678",
    type: "AHO",
    balance: 2250.75,
    state: "ACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440002",
    accountNumber: "0012345679",
    type: "CTE",
    balance: 850.25,
    state: "ACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: "2024-01-16T11:30:00Z",
    updatedAt: "2024-01-19T16:45:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440003",
    accountNumber: "0012345680",
    type: "AHO",
    balance: 1875.5,
    state: "ACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440002",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-21T10:30:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440004",
    accountNumber: "0012345681",
    type: "CTE",
    balance: 0.0,
    state: "INACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440003",
    createdAt: "2024-01-17T14:45:00Z",
    updatedAt: "2024-01-18T09:20:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440005",
    accountNumber: "0012345682",
    type: "AHO",
    balance: 4125.8,
    state: "ACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440004",
    createdAt: "2024-01-18T11:20:00Z",
    updatedAt: "2024-01-22T13:40:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440006",
    accountNumber: "0012345683",
    type: "CTE",
    balance: 925.45,
    state: "ACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440005",
    createdAt: "2024-01-19T16:30:00Z",
    updatedAt: "2024-01-23T08:15:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440007",
    accountNumber: "0012345684",
    type: "AHO",
    balance: 125.3,
    state: "ACTIVE",
    clientId: "550e8400-e29b-41d4-a716-446655440005",
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-23T15:25:00Z",
  },
];

export const mockAccountListItems: AccountListItem[] = [
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440001",
    accountNumber: "0012345678",
    type: "AHO",
    balance: 2250.75,
    state: "ACTIVE",
    clientName: "Juan Carlos Pérez",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440002",
    accountNumber: "0012345679",
    type: "CTE",
    balance: 850.25,
    state: "ACTIVE",
    clientName: "Juan Carlos Pérez",
    createdAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440003",
    accountNumber: "0012345680",
    type: "AHO",
    balance: 1875.5,
    state: "ACTIVE",
    clientName: "María Elena García",
    createdAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440004",
    accountNumber: "0012345681",
    type: "CTE",
    balance: 0.0,
    state: "INACTIVE",
    clientName: "Luis Fernando Rodríguez",
    createdAt: "2024-01-17T14:45:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440005",
    accountNumber: "0012345682",
    type: "AHO",
    balance: 4125.8,
    state: "ACTIVE",
    clientName: "Ana Patricia Silva",
    createdAt: "2024-01-18T11:20:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440006",
    accountNumber: "0012345683",
    type: "CTE",
    balance: 925.45,
    state: "ACTIVE",
    clientName: "Carlos Eduardo Mendoza",
    createdAt: "2024-01-19T16:30:00Z",
  },
  {
    id: "acc-550e8400-e29b-41d4-a716-446655440007",
    accountNumber: "0012345684",
    type: "AHO",
    balance: 125.3,
    state: "ACTIVE",
    clientName: "Carlos Eduardo Mendoza",
    createdAt: "2024-01-20T12:00:00Z",
  },
];

export const getMockAccountsByClientId = (clientId: string): Account[] => {
  return mockAccounts.filter((account) => account.clientId === clientId);
};

export const getMockAccountById = (id: string): Account | undefined => {
  return mockAccounts.find((account) => account.id === id);
};

export const getMockAccountByNumber = (number: string): Account | undefined => {
  return mockAccounts.find((account) => account.accountNumber === number);
};

export const searchMockAccounts = (query: string): AccountListItem[] => {
  if (!query) return mockAccountListItems;

  const lowercaseQuery = query.toLowerCase();
  return mockAccountListItems.filter(
    (account) =>
      account.accountNumber.includes(query) ||
      account.clientName?.toLowerCase().includes(lowercaseQuery) ||
      account.type.toLowerCase().includes(lowercaseQuery)
  );
};

export const getMockAccountsByType = (type: "AHO" | "CTE"): Account[] => {
  return mockAccounts.filter((account) => account.type === type);
};

export const getActiveMockAccounts = (): Account[] => {
  return mockAccounts.filter((account) => account.state === "ACTIVE");
};
