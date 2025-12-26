import { Card, Label, Skeleton } from "@/components";
import { FundData } from "../hooks/use-fund-operate-data";

export default function ThesisCard({
  fundData,
  isLoading,
}: {
  fundData: FundData;
  isLoading: boolean;
}) {
  const thesisItems = fundData.metadata?.thesis || [];
  const goalItems = fundData.metadata?.goals || [];
  const hasMetadata = fundData.metadata && (thesisItems.length > 0 || goalItems.length > 0);

  return (
    <div className="flex-1 flex-col gap-4">
      <Card className="!max-w-full w-full min-w-0 !h-auto overflow-hidden" variant="fund">
        <div className="flex flex-wrap gap-4">
          {/* Column 1 */}
          <div className="flex-1 min-w-[300px]">
            <Label label="Thesis" className="domain-title mb-2" />
            {isLoading ? (
              <Skeleton lines={3} />
            ) : hasMetadata && thesisItems.length > 0 ? (
              <ul className="list-disc list-outside pl-6 text-sm text-neutral font-montserrat leading-snug whitespace-normal [overflow-wrap:anywhere] hyphens-auto">
                {thesisItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral font-montserrat">No information available.</p>
            )}
          </div>

          {/* Column 2 */}
          <div className="flex-1 min-w-[300px]">
            <Label label="Goal" className="domain-title mb-2" />
            {isLoading ? (
              <Skeleton lines={3} />
            ) : hasMetadata && goalItems.length > 0 ? (
              <ul className="list-disc list-outside pl-6 text-sm text-neutral font-montserrat leading-snug whitespace-normal [overflow-wrap:anywhere] hyphens-auto">
                {goalItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral font-montserrat">No information available.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
