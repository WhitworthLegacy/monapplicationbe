import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#0f172a] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5
            ${icon ? 'pl-10' : ''}
            bg-white
            border border-[#e2e8f0]
            rounded-lg
            text-[#0f172a]
            placeholder:text-[#64748b]
            focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:border-transparent
            disabled:bg-[#f1f5f9] disabled:cursor-not-allowed
            transition-colors
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-[#64748b]">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
