import type {
  Movement,
  MovementListItem,
  MovementReportItem,
  JsonReportResponse,
} from "../../../../types/movements";

export const mockMovements: Movement[] = [
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440001",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440001",
    movementType: "DEPOSIT",
    amount: 500.0,
    balance: 2250.75,
    date: "2024-01-20T14:15:00Z",
    isReversed: false,
    createdAt: "2024-01-20T14:15:00Z",
    updatedAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440002",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440001",
    movementType: "WITHDRAWAL",
    amount: 250.0,
    balance: 1750.75,
    date: "2024-01-19T10:30:00Z",
    isReversed: false,
    createdAt: "2024-01-19T10:30:00Z",
    updatedAt: "2024-01-19T10:30:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440003",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440001",
    movementType: "DEPOSIT",
    amount: 1000.0,
    balance: 2000.75,
    date: "2024-01-18T16:45:00Z",
    isReversed: false,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440004",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440002",
    movementType: "DEPOSIT",
    amount: 350.25,
    balance: 850.25,
    date: "2024-01-19T16:45:00Z",
    isReversed: false,
    createdAt: "2024-01-19T16:45:00Z",
    updatedAt: "2024-01-19T16:45:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440005",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440002",
    movementType: "WITHDRAWAL",
    amount: 150.0,
    balance: 500.0,
    date: "2024-01-17T09:20:00Z",
    isReversed: false,
    createdAt: "2024-01-17T09:20:00Z",
    updatedAt: "2024-01-17T09:20:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440006",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440003",
    movementType: "WITHDRAWAL",
    amount: 124.5,
    balance: 1875.5,
    date: "2024-01-21T10:30:00Z",
    isReversed: false,
    createdAt: "2024-01-21T10:30:00Z",
    updatedAt: "2024-01-21T10:30:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440007",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440003",
    movementType: "DEPOSIT",
    amount: 800.0,
    balance: 2000.0,
    date: "2024-01-20T14:20:00Z",
    isReversed: false,
    createdAt: "2024-01-20T14:20:00Z",
    updatedAt: "2024-01-20T14:20:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440008",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440004",
    movementType: "WITHDRAWAL",
    amount: 1000.0,
    balance: 0.0,
    date: "2024-01-18T09:20:00Z",
    isReversed: false,
    createdAt: "2024-01-18T09:20:00Z",
    updatedAt: "2024-01-18T09:20:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440009",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440005",
    movementType: "DEPOSIT",
    amount: 1125.8,
    balance: 4125.8,
    date: "2024-01-22T13:40:00Z",
    isReversed: false,
    createdAt: "2024-01-22T13:40:00Z",
    updatedAt: "2024-01-22T13:40:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440010",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440005",
    movementType: "WITHDRAWAL",
    amount: 200.0,
    balance: 3000.0,
    date: "2024-01-21T11:15:00Z",
    isReversed: false,
    createdAt: "2024-01-21T11:15:00Z",
    updatedAt: "2024-01-21T11:15:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440011",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440006",
    movementType: "DEPOSIT",
    amount: 175.45,
    balance: 925.45,
    date: "2024-01-23T08:15:00Z",
    isReversed: false,
    createdAt: "2024-01-23T08:15:00Z",
    updatedAt: "2024-01-23T08:15:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440012",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440006",
    movementType: "WITHDRAWAL",
    amount: 100.0,
    balance: 750.0,
    date: "2024-01-22T16:30:00Z",
    isReversed: false,
    createdAt: "2024-01-22T16:30:00Z",
    updatedAt: "2024-01-22T16:30:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440013",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440007",
    movementType: "WITHDRAWAL",
    amount: 374.7,
    balance: 125.3,
    date: "2024-01-23T15:25:00Z",
    isReversed: false,
    createdAt: "2024-01-23T15:25:00Z",
    updatedAt: "2024-01-23T15:25:00Z",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440014",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440007",
    movementType: "DEPOSIT",
    amount: 300.0,
    balance: 500.0,
    date: "2024-01-22T12:10:00Z",
    isReversed: false,
    createdAt: "2024-01-22T12:10:00Z",
    updatedAt: "2024-01-22T12:10:00Z",
  },
];

export const mockMovementListItems: MovementListItem[] = [
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440001",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440001",
    movementType: "DEPOSIT",
    amount: 500.0,
    balance: 2250.75,
    date: "2024-01-20T14:15:00Z",
    isReversed: false,
    createdAt: "2024-01-20T14:15:00Z",
    accountNumber: "0012345678",
    clientName: "Juan Carlos Pérez",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440002",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440001",
    movementType: "WITHDRAWAL",
    amount: 250.0,
    balance: 1750.75,
    date: "2024-01-19T10:30:00Z",
    isReversed: false,
    createdAt: "2024-01-19T10:30:00Z",
    accountNumber: "0012345678",
    clientName: "Juan Carlos Pérez",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440003",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440001",
    movementType: "DEPOSIT",
    amount: 1000.0,
    balance: 2000.75,
    date: "2024-01-18T16:45:00Z",
    isReversed: false,
    createdAt: "2024-01-18T16:45:00Z",
    accountNumber: "0012345678",
    clientName: "Juan Carlos Pérez",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440004",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440002",
    movementType: "DEPOSIT",
    amount: 350.25,
    balance: 850.25,
    date: "2024-01-19T16:45:00Z",
    isReversed: false,
    createdAt: "2024-01-19T16:45:00Z",
    accountNumber: "0012345679",
    clientName: "Juan Carlos Pérez",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440005",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440002",
    movementType: "WITHDRAWAL",
    amount: 150.0,
    balance: 500.0,
    date: "2024-01-17T09:20:00Z",
    isReversed: false,
    createdAt: "2024-01-17T09:20:00Z",
    accountNumber: "0012345679",
    clientName: "Juan Carlos Pérez",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440006",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440003",
    movementType: "WITHDRAWAL",
    amount: 124.5,
    balance: 1875.5,
    date: "2024-01-21T10:30:00Z",
    isReversed: false,
    createdAt: "2024-01-21T10:30:00Z",
    accountNumber: "0012345680",
    clientName: "María Elena García",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440007",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440003",
    movementType: "DEPOSIT",
    amount: 800.0,
    balance: 2000.0,
    date: "2024-01-20T14:20:00Z",
    isReversed: false,
    createdAt: "2024-01-20T14:20:00Z",
    accountNumber: "0012345680",
    clientName: "María Elena García",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440008",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440004",
    movementType: "WITHDRAWAL",
    amount: 1000.0,
    balance: 0.0,
    date: "2024-01-18T09:20:00Z",
    isReversed: false,
    createdAt: "2024-01-18T09:20:00Z",
    accountNumber: "0012345681",
    clientName: "Luis Fernando Rodríguez",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440009",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440005",
    movementType: "DEPOSIT",
    amount: 1125.8,
    balance: 4125.8,
    date: "2024-01-22T13:40:00Z",
    isReversed: false,
    createdAt: "2024-01-22T13:40:00Z",
    accountNumber: "0012345682",
    clientName: "Ana Patricia Silva",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440010",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440005",
    movementType: "WITHDRAWAL",
    amount: 200.0,
    balance: 3000.0,
    date: "2024-01-21T11:15:00Z",
    isReversed: false,
    createdAt: "2024-01-21T11:15:00Z",
    accountNumber: "0012345682",
    clientName: "Ana Patricia Silva",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440011",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440006",
    movementType: "DEPOSIT",
    amount: 175.45,
    balance: 925.45,
    date: "2024-01-23T08:15:00Z",
    isReversed: false,
    createdAt: "2024-01-23T08:15:00Z",
    accountNumber: "0012345683",
    clientName: "Carlos Eduardo Mendoza",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440012",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440006",
    movementType: "WITHDRAWAL",
    amount: 100.0,
    balance: 750.0,
    date: "2024-01-22T16:30:00Z",
    isReversed: false,
    createdAt: "2024-01-22T16:30:00Z",
    accountNumber: "0012345683",
    clientName: "Carlos Eduardo Mendoza",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440013",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440007",
    movementType: "WITHDRAWAL",
    amount: 374.7,
    balance: 125.3,
    date: "2024-01-23T15:25:00Z",
    isReversed: false,
    createdAt: "2024-01-23T15:25:00Z",
    accountNumber: "0012345684",
    clientName: "Carlos Eduardo Mendoza",
  },
  {
    id: "mov-550e8400-e29b-41d4-a716-446655440014",
    accountId: "acc-550e8400-e29b-41d4-a716-446655440007",
    movementType: "DEPOSIT",
    amount: 300.0,
    balance: 500.0,
    date: "2024-01-22T12:10:00Z",
    isReversed: false,
    createdAt: "2024-01-22T12:10:00Z",
    accountNumber: "0012345684",
    clientName: "Carlos Eduardo Mendoza",
  },
];

export const getMockMovementsByAccountId = (accountId: string): Movement[] => {
  return mockMovements.filter((movement) => movement.accountId === accountId);
};

export const getMockMovementById = (id: string): Movement | undefined => {
  return mockMovements.find((movement) => movement.id === id);
};

export const getMockMovementsByDateRange = (
  startDate: string,
  endDate: string
): Movement[] => {
  return mockMovements.filter(
    (movement) => movement.date >= startDate && movement.date <= endDate
  );
};

export const getMockMovementsByType = (
  type: "DEPOSIT" | "WITHDRAWAL"
): Movement[] => {
  return mockMovements.filter((movement) => movement.movementType === type);
};

export const searchMockMovements = (query: string): MovementListItem[] => {
  if (!query) return mockMovementListItems;

  const lowercaseQuery = query.toLowerCase();
  return mockMovementListItems.filter(
    (movement) =>
      movement.accountNumber?.includes(query) ||
      movement.clientName?.toLowerCase().includes(lowercaseQuery) ||
      movement.movementType.toLowerCase().includes(lowercaseQuery) ||
      movement.amount.toString().includes(query)
  );
};

export const getMockMovementsByClientName = (
  clientName: string
): MovementListItem[] => {
  return mockMovementListItems.filter((movement) =>
    movement.clientName?.toLowerCase().includes(clientName.toLowerCase())
  );
};

export const getRecentMockMovements = (): MovementListItem[] => {
  return mockMovementListItems
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
};

// Mock API report response format
export const getMockJsonReportResponse = (
  accountId?: string
): JsonReportResponse => {
  let movements = mockMovementListItems;

  if (accountId && accountId !== "all") {
    movements = movements.filter(
      (movement) => movement.accountId === accountId
    );
  }

  const jsonReport: MovementReportItem[] = movements.map((movement) => ({
    date: movement.date,
    amount: movement.amount,
    clientId: movement.accountId, // Using accountId as clientId for mock
    balance: movement.balance,
    clientName: movement.clientName || "Unknown Client",
    id: movement.id,
    type: movement.movementType,
    accountNumber: movement.accountNumber || "Unknown Account",
  }));

  return { jsonReport };
};
