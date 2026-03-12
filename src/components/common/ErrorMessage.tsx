interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 text-sm font-medium bg-red-100 rounded hover:bg-red-200 transition-colors min-h-[44px]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
