type CheckInButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export function CheckInButton({ disabled, onClick }: CheckInButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Check in now
    </button>
  );
}
