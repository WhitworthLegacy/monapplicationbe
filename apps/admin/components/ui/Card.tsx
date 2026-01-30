interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'default' | 'lg';
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'default',
  onClick,
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'transition-shadow duration-200 hover:shadow-md'
    : '';

  return (
    <div
      className={`bg-white rounded-2xl border border-[#e2e8f0] shadow-sm ${hoverStyles} ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-[#e2e8f0] pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-[#0f172a] ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

export { Card };
