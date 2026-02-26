"use client";

interface QuizStepProps {
  question: string;
  options: string[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multiSelect: boolean;
  stepNumber: number;
  totalSteps: number;
}

export default function QuizStep({
  question,
  options,
  selected,
  onSelect,
  multiSelect,
  stepNumber,
  totalSteps,
}: QuizStepProps) {
  const progressPercent = (stepNumber / totalSteps) * 100;

  function isSelected(option: string): boolean {
    if (Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs text-text-secondary">
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-tag-bg">
          <div
            className="h-full rounded-full bg-accent-green transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={stepNumber}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${stepNumber} of ${totalSteps}`}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-heading text-xl font-semibold text-text-primary sm:text-2xl">
        {question}
      </h2>

      {multiSelect && (
        <p className="mt-2 font-body text-sm text-text-secondary">
          Select all that apply
        </p>
      )}

      {/* Options */}
      <div className="mt-6 flex flex-col gap-3" role="group" aria-label={question}>
        {options.map((option) => {
          const active = isSelected(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`min-h-[48px] w-full rounded-card border px-5 py-3 text-left font-body text-sm font-medium transition-all ${
                active
                  ? "border-accent-green bg-accent-green/5 text-accent-green ring-1 ring-accent-green"
                  : "border-border bg-surface text-text-primary hover:border-accent-green-light hover:bg-tag-bg"
              }`}
              aria-pressed={active}
            >
              <span className="flex items-center gap-3">
                {/* Selection Indicator */}
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-${
                    multiSelect ? "sm" : "full"
                  } border transition-colors ${
                    active
                      ? "border-accent-green bg-accent-green"
                      : "border-border bg-surface"
                  }`}
                  aria-hidden="true"
                >
                  {active && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </span>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
