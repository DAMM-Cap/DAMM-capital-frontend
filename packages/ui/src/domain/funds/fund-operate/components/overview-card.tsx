import { Card, InfoLabel, Label, Skeleton } from "@/components";
import { FundData } from "../hooks/use-fund-operate-data";

export default function OverviewCard({
  fundData,
  isLoading,
}: {
  fundData: FundData;
  isLoading: boolean;
}) {
  const overview = fundData.metadata?.overview;
  const hasMetadata = overview && overview.trim().length > 0;

  return (
    <Card variant="fund" className="!max-w-full min-w-0 h-auto overflow-visible">
      <Label label="Overview" className="domain-title mb-2" />
      {isLoading ? (
        <Skeleton lines={3} />
      ) : hasMetadata ? (
        <InfoLabel className="overflow-visible max-h-none">{overview}</InfoLabel>
      ) : (
        <InfoLabel className="overflow-visible max-h-none">
          No information available.
        </InfoLabel>
      )}
    </Card>
  );
}
