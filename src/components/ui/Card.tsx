import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm",
        hover && "hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-200 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
