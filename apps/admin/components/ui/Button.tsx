import Link from 'next/link';
import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  isLoading?: boolean; // Alias for loading
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  isLoading,
  className = '',
  disabled,
  ...props
}, ref) => {
  // Use isLoading if provided, otherwise fall back to loading
  const isButtonLoading = isLoading ?? loading;
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-[#b8860b] hover:brightness-110 hover:shadow-lg text-white shadow-sm focus:ring-[#b8860b] hover:-translate-y-0.5 dark:bg-[#d4a72c]',
    secondary: 'bg-[#0f172a] border-2 border-[#0f172a] text-white hover:bg-transparent hover:text-[#0f172a] hover:shadow-md focus:ring-[#0f172a] dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-transparent dark:hover:text-gray-300',
    ghost: 'bg-transparent text-[#0f172a] hover:bg-[#f1f5f9] border border-[#e2e8f0] focus:ring-[#0f172a] hover:border-[#cbd5e1] dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 hover:shadow-lg text-white focus:ring-red-500 hover:-translate-y-0.5 dark:bg-red-600 dark:hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-sm',
    lg: 'px-8 py-2.5 text-base',
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {isButtonLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isButtonLoading}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;
