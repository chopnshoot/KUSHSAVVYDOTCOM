"use client";

interface UsageCounterProps {
  used: number;
  limit: number;
}

export default function UsageCounter({ used, limit }: UsageCounterProps) {
  if (limit <= 0) return null;

  const isSubscriber = limit > 10;

  return (
    <div className="text-center mt-6">
      <p className="text-text-tertiary text-sm">
        {used} of {limit} free searches used today
        {isSubscriber && (
          <span className="ml-1 text-accent-green font-medium">(Subscriber)</span>
        )}
      </p>
    </div>
  );
}
