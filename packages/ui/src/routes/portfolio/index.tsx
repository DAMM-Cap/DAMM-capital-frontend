import Portfolio from "@/domain/portfolio/portfolio";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portfolio/")({
  component: Portfolio,
});
