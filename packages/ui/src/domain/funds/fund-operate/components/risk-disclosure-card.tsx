import { Card, InfoLabel, Label, Skeleton } from "@/components";
import { FundData } from "../hooks/use-fund-operate-data";

export default function RiskDisclosureCard({
  fundData,
  isLoading,
}: {
  fundData: FundData;
  isLoading: boolean;
}) {
  const riskDisclosure = fundData.metadata?.riskDisclosure;
  const hasMetadata = riskDisclosure !== undefined && riskDisclosure !== null;

  return (
    <Card variant="fund" className="!max-w-full min-w-0 h-auto overflow-visible">
      <Label label="Risk Disclosure" className="domain-title mb-2" />
      {isLoading ? (
        <Skeleton lines={3} />
      ) : hasMetadata ? (
        <InfoLabel className="overflow-visible max-h-none">
          {riskDisclosure.intro}
          <ol className="mt-2 list-decimal list-outside pl-6 text-sm text-neutral font-montserrat leading-snug break-words whitespace-normal hyphens-auto">
            {riskDisclosure.items.map((item, index) => (
              <li key={index} className="mt-4">
                <strong>{item.title}:</strong> {item.description}
              </li>
            ))}
          </ol>
        </InfoLabel>
      ) : (
        <InfoLabel className="overflow-visible max-h-none">
          No information available.
        </InfoLabel>
      )}
    </Card>
  );
}
