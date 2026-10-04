import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

type FieldShared = {
  label: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
};

const control =
  'w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted transition-colors duration-(--dur-fast) hover:border-muted focus-visible:border-accent-ink aria-invalid:border-danger';

function FieldShell({
  id,
  label,
  hint,
  error,
  optionalLabel,
  children,
}: FieldShared & { id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {optionalLabel && <span className="text-muted text-xs font-normal">{optionalLabel}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-muted text-sm">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

type InputProps = FieldShared & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>;

export function Input({ label, hint, error, optionalLabel, className, ...props }: InputProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optionalLabel={optionalLabel}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, className)}
        {...props}
      />
    </FieldShell>
  );
}

type TextareaProps = FieldShared & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;

export function Textarea({
  label,
  hint,
  error,
  optionalLabel,
  className,
  ...props
}: TextareaProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optionalLabel={optionalLabel}>
      <textarea
        id={id}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, 'resize-y', className)}
        {...props}
      />
    </FieldShell>
  );
}

type SelectProps = FieldShared &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function Select({
  label,
  hint,
  error,
  optionalLabel,
  options,
  placeholder,
  className,
  ...props
}: SelectProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optionalLabel={optionalLabel}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  label: React.ReactNode;
  error?: string;
};

export function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn('mt-0.5 size-5 shrink-0 accent-[var(--accent-ink)]', className)}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
