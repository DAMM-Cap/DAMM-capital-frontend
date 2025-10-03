import { Card, Label } from "@/components";

export default function ThesisCard() {
  return (
    <div className="flex-1 flex-col gap-4">
      <Card className="!max-w-full w-full min-w-0 !h-auto overflow-hidden" variant="fund">
        <div className="flex flex-wrap gap-4 justify-start">
          {/* Column 1 */}
          <div className="flex-1 min-w-[300px]">
            <Label label="Thesis" className="domain-title mb-2" />
            <ul className="list-disc list-outside pl-6 text-sm text-neutral font-montserrat leading-snug whitespace-normal break-words [overflow-wrap:anywhere] hyphens-auto">
              <li>Provide low-risk stable yield on popular USD stablecoins.</li>
              <li>
                Assets are invested in short-term unleveraged concentrated liquidity positions.
              </li>
              <li>All underlying positions are always immediately liquidateable (t0).</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex-1 min-w-[300px]">
            <Label label="Goal" className="domain-title mb-2" />
            <ul className="list-disc list-outside pl-6 text-sm text-neutral font-montserrat leading-snug whitespace-normal break-words [overflow-wrap:anywhere] hyphens-auto">
              <li>
                The DAMM USD Stablecoin Money Market Fund seeks to provide stable yield for idle USD
                stablecoin liquidity.
              </li>
              <li>
                Get the best risk adjusted yield on USDC denominated strategies across a diversified
                set of DeFi protocols.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
