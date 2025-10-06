import { Card, InfoLabel, Label } from "@/components";

export default function OverviewCard() {
  return (
    <Card variant="fund" className="!max-w-full min-w-0 h-auto overflow-visible">
      <Label label="Overview" className="domain-title mb-2" />
      <InfoLabel className="overflow-visible max-h-none">
        DAMMstable is a systematic, market-neutral fund designed to deliver the best risk-adjusted
        returns on USD-denominated stablecoins. It generates genuine yield without reliance on
        external incentives, investing exclusively in short-term, actively managed liquidity
        positions on Uniswap V3 and Aave V3. The strategy is entirely algorithmic, operating without
        leverage, and maintains exposure solely to blue-chip stablecoins -USDC, USDT, USDCe, and
        DAI- and to the protocols in which they are deployed. By combining disciplined execution
        with prudent asset selection, DAMMstable offers sophisticated investors stable, transparent,
        and repeatable returns with a strong emphasis on capital preservation.
      </InfoLabel>
    </Card>
  );
}
