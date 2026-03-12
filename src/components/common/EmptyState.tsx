interface EmptyStateProps {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ message, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <p className="text-lg mb-4">{message}</p>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-base font-medium min-h-[44px] min-w-[44px] hover:bg-blue-600 transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
