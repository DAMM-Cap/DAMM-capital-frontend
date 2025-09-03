const EnterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 21H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
    <path d="M8 17l5-5-5-5" />
    <path d="M3 12H15" />
  </svg>
);

export default EnterIcon;
