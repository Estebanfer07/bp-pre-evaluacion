import type { ClientResponse, ClientListItem } from "../../../../types/clients";

export const mockClients: ClientResponse[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    person: {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "Juan Carlos Pérez",
      gender: "MALE",
      age: 35,
      identification: "1234567890",
      address: "Av. Principal 123, Quito",
      phone: "0987654321",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    state: "ACTIVE",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    person: {
      id: "550e8400-e29b-41d4-a716-446655440011",
      name: "María Elena García",
      gender: "FEMALE",
      age: 28,
      identification: "0987654321",
      address: "Calle Secundaria 456, Guayaquil",
      phone: "0912345678",
      createdAt: "2024-01-16T09:15:00Z",
      updatedAt: "2024-01-16T09:15:00Z",
    },
    state: "ACTIVE",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    person: {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "Luis Fernando Rodríguez",
      gender: "MALE",
      age: 42,
      identification: "1122334455",
      address: "Urbanización Los Pinos, Casa 789, Cuenca",
      phone: "0998877665",
      createdAt: "2024-01-17T14:45:00Z",
      updatedAt: "2024-01-17T14:45:00Z",
    },
    state: "INACTIVE",
    createdAt: "2024-01-17T14:45:00Z",
    updatedAt: "2024-01-17T14:45:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    person: {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "Ana Patricia Silva",
      gender: "FEMALE",
      age: 31,
      identification: "5566778899",
      address: "Sector Norte, Manzana 12, Lote 34, Ambato",
      phone: "0976543210",
      createdAt: "2024-01-18T11:20:00Z",
      updatedAt: "2024-01-18T11:20:00Z",
    },
    state: "ACTIVE",
    createdAt: "2024-01-18T11:20:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    person: {
      id: "550e8400-e29b-41d4-a716-446655440014",
      name: "Carlos Eduardo Mendoza",
      gender: "MALE",
      age: 29,
      identification: "9988776655",
      address: "Barrio La Floresta, Calle 10 de Agosto 567, Quito",
      phone: "0954321098",
      createdAt: "2024-01-19T16:30:00Z",
      updatedAt: "2024-01-19T16:30:00Z",
    },
    state: "ACTIVE",
    createdAt: "2024-01-19T16:30:00Z",
    updatedAt: "2024-01-19T16:30:00Z",
  },
];

export const mockClientListItems: ClientListItem[] = mockClients.map(
  (client) => ({
    id: client.id,
    person: {
      id: client.person.id,
      name: client.person.name,
      gender: client.person.gender,
      age: client.person.age,
      identification: client.person.identification,
      address: client.person.address,
      phone: client.person.phone,
      createdAt: client.person.createdAt,
      updatedAt: client.person.updatedAt,
    },
    password: "", // mock password, adjust as needed
    state: client.state,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  })
);

export const getMockClientById = (id: string): ClientResponse | undefined => {
  return mockClients.find((client) => client.id === id);
};

export const searchMockClients = (query: string): ClientResponse[] => {
  if (!query) return mockClients;

  const lowercaseQuery = query.toLowerCase();
  return mockClients.filter(
    (client) =>
      client.person.name.toLowerCase().includes(lowercaseQuery) ||
      client.person.identification.includes(query) ||
      client.person.phone.includes(query)
  );
};
