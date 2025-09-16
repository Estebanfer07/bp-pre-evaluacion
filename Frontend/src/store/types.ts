// Types for our entities
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  clientId: string;
  accountNumber: string;
  balance: number;
  type: "savings" | "checking";
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  accountId: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description: string;
  createdAt: string;
}

export interface AppState {
  // UI State
  isLoading: boolean;
  error: string | null;

  // Data State
  clients: Client[];
  accounts: Account[];
  movements: Movement[];

  // Selected entities
  selectedClient: Client | null;
  selectedAccount: Account | null;
}
