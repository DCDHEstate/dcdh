"use client";

// Multi-select chip grid used by the amenity and furnishing pickers in both
// the post-property and edit-property forms.
export default function CheckGrid({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((o) => {
        const isSelected = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(o.id)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
              isSelected
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted hover:border-primary/50"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                isSelected ? "border-primary bg-primary" : "border-border bg-surface-subtle"
              }`}
            >
              {isSelected && (
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
