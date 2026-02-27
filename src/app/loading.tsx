export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-border border-t-accent-green rounded-full animate-spin" />
        <p className="text-text-tertiary text-sm">Loading...</p>
      </div>
    </div>
  );
}
