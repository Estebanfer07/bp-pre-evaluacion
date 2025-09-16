import { createFileRoute } from "@tanstack/react-router";
import { MovementsPage } from "../pages/movement/MovementsPage";

export const Route = createFileRoute("/movements")({
  component: () => <MovementsPage />,
});
