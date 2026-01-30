interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'default' | 'lg';
  onClick?: () => void;
}

export { function };

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
