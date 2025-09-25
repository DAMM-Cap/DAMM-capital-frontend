import Funds from "@/domain/funds";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/funds/")({
  component: Funds,
});
