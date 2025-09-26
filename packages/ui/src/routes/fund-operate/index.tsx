import FundOperate from "@/domain/funds/fund-operate";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const depositSearchSchema = z.object({
  vaultId: z.string().optional(),
});

export const Route = createFileRoute("/fund-operate/")({
  component: FundOperate,
  validateSearch: (search) => depositSearchSchema.parse(search),
});
