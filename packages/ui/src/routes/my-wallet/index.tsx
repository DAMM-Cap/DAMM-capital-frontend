import MyWallet from "@/domain/my-wallet/my-wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-wallet/")({
  component: MyWallet,
});
