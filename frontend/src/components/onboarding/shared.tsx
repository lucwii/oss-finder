import { Check, X } from 'lucide-react';

export function Badge({ text }: { text: string }) {
  return (
    <div
      className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest mb-5 uppercase"
      style={{
        background: 'rgba(34,197,94,0.07)',
        border:     '1px solid rgba(34,197,94,0.16)',
        color:      '#22c55e',
      }}
    >
      {text}
    </div>
  );
}

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[27px] font-bold text-white mb-2 leading-tight">
      {children}
    </h1>
  );
}

export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#a1a1aa] text-sm mb-6 leading-relaxed">{children}</p>
  );
}

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[#52525b] hover:text-[#a1a1aa] text-sm transition-colors mb-5 group"
    >
      <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span>
      Back
    </button>
  );
}

export function ContinueBtn({
  onClick,
  disabled,
  loading,
  glow,
  children,
}: {
  onClick:   () => void;
  disabled?: boolean;
  loading?:  boolean;
  glow?:     boolean;
  children:  React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
      style={{
        background: disabled ? '#18181b' : '#22c55e',
        color:      disabled ? '#3f3f46' : '#000',
        cursor:     disabled ? 'not-allowed' : 'pointer',
        border:     `1.5px solid ${disabled ? '#27272a' : '#22c55e'}`,
        boxShadow:  disabled
          ? 'none'
          : glow
          ? '0 0 28px rgba(34,197,94,0.4), 0 0 56px rgba(34,197,94,0.12)'
          : '0 0 16px rgba(34,197,94,0.22)',
      }}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />
          Setting up your profile...
        </>
      ) : children}
    </button>
  );
}

export function Checkmark({ size = 5 }: { size?: number }) {
  const px = size === 5 ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <span
      className={`absolute top-2.5 right-2.5 ${px} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{ background: '#22c55e', animation: 'ob-check-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
    >
      <Check size={size === 5 ? 11 : 9} strokeWidth={3} color="#000" />
    </span>
  );
}

export function ErrorBanner({
  message,
  onClear,
}: {
  message:  string;
  onClear:  () => void;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-xl mt-4"
      style={{
        background: 'rgba(239,68,68,0.08)',
        border:     '1px solid rgba(239,68,68,0.2)',
        animation:  'slideDown 0.22s ease both',
      }}
    >
      <p className="text-[#ef4444] text-sm flex-1 leading-snug">{message}</p>
      <button
        onClick={onClear}
        className="text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}
