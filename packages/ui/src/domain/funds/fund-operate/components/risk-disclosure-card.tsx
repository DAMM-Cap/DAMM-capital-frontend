import { Card, InfoLabel, Label, Skeleton } from "@/components";

export default function RiskDisclosureCard({ isLoading }: { isLoading: boolean }) {
  return (
    <Card variant="fund" className="!max-w-full min-w-0 h-auto overflow-visible">
      <Label label="Risk Disclosure" className="domain-title mb-2" />
      {isLoading ? (
        <Skeleton lines={3} />
      ) : (
        <InfoLabel className="overflow-visible max-h-none">
          We always seek to minimize risk wherever possible; however, decentralized finance (DeFi)
          operates in a highly adversarial environment where protocols are frequently targeted for
          exploits and attacks. The following are key risks associated with the DAMM USD stablecoin
          Money Market Fund:
          <ol className="mt-2 list-decimal list-outside pl-6 text-sm text-neutral font-montserrat leading-snug break-words whitespace-normal hyphens-auto">
            <li className="mt-4">
              <strong>Smart Contract Risks:</strong> Despite thorough due diligence, smart contracts
              can contain undiscovered bugs or behave in unanticipated ways, resulting in assets
              being frozen, lost, or exploited. This risk, inherent to the DeFi ecosystem, could
              impact the stability and security of the fund's holdings.
            </li>
            <li className="mt-4">
              <strong>Custodial and Multisig Risks:</strong> Assets within this fund are stored in a
              Gnosis Safe Multisig wallet for added security, requiring multiple authorized
              signatures for transactions. However, if all signers' private keys are compromised,
              the entire asset pool could be at risk of loss.
            </li>
            <li className="mt-4">
              <strong>Stablecoin Depeg Risks:</strong> While stablecoins are generally designed to
              maintain a 1-to-1 peg with the U.S. Dollar, temporary depegs can occur during periods
              of market stress. Although many of these are resolved quickly, there is a risk of a
              permanent depeg, which could lead to significant losses for the fund if the
              stablecoin's value diverges from its intended dollar parity.
            </li>
          </ol>
        </InfoLabel>
      )}
    </Card>
  );
}
