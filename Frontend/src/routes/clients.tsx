import { createFileRoute } from "@tanstack/react-router";
import { ClientsPage } from "../pages/client/ClientsPage";

export const Route = createFileRoute("/clients")({
  component: () => <ClientsPage />,
});
