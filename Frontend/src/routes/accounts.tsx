import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "../pages/account/AccountsPage";

export const Route = createFileRoute("/accounts")({
  component: () => <AccountsPage />,
});
