import { AmountComponent, Button, DammStableIcon, DepositModal, Input } from "@/components";
import EnterIcon from "@/components/icons/EnterIcon";
import RedeemIcon from "@/components/icons/RedeemIcon";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-4">
        <Input type="text" value={text} onChange={setText} />
        <Input
          label="Amount"
          value={amount}
          onChange={setAmount}
          max={1000}
          onMaxClick={() => setAmount("1000")}
        />
        {/* Button custom */}
        <Button onClick={() => setOpenModal(true)}>
          <RedeemIcon />
          Click me
        </Button>
        <Button onClick={() => {}} variant="secondary">
          <EnterIcon />
          Click me
        </Button>
        <Button onClick={() => {}} variant="disabled">
          Click me
        </Button>
        <Button onClick={() => {}} variant="loading">
          Click me
        </Button>
        {/* Invalid state */}
        <Input
          value={value}
          onChange={setValue}
          validation="invalid"
          validationMessage="This field is required"
        />
        {/* Success state */}
        <Input
          value={value}
          onChange={setValue}
          validation="success"
          validationMessage="Email is valid"
        />
        {/* Left-aligned secondary label */}
        <Input value={value} onChange={setValue} secondaryLabel="Optional helper text" />
        {/* Right-aligned secondary label */}
        <Input
          value={value}
          onChange={setValue}
          secondaryLabel="Optional helper text"
          secondaryLabelAlign="right"
        />
        <AmountComponent
          tokenLabel="DUSDC"
          tokenIcon={<DammStableIcon size={20} />}
          tokenSecondaryLabel="$0"
          conversionLeftText="1 USDC"
          conversionRightText="0.935 DAMM USDC"
          amount={amount}
          onAmountChange={setAmount}
          onMaxClick={() => setAmount("1000")}
          max={1000}
        />

        {/* Modal */}
        <DepositModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          amount={amount}
          onAmountChange={setAmount}
          onMaxClick={() => setAmount("1000")}
          max={1000}
          referralCode={text}
          onReferralCodeChange={setText}
          onDeposit={() => {}}
          isLoading={isLoading}
          isInsufficientBalance={isInsufficientBalance}
        />
      </div>
    </div>
  );
}
