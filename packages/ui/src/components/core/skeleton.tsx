import { LoadingField } from "@/components";

export default function Skeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingField key={i} className="!h-6" />
      ))}
    </div>
  );
}
