function Skeleton({ className, variant }: { className?: string; variant?: "rounded" | "default" }) {
  return variant === "rounded" ? (
    <div className={`w-8 h-8 bg-secondary rounded-full flex-shrink-0 ${className}`}></div>
  ) : (
    <div className="col-span-2 w-full">
      <div className={`w-full h-6 bg-secondary rounded-2xl text-center ${className}`}></div>
    </div>
  );
}

export default Skeleton;
