import { cn } from "@/lib/utils";
import React from "react";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
  children: React.ReactNode;
}

export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, innerClassName, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "bg-white border border-slate-200/60",
          "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
          "rounded-[2.5rem] flex flex-col relative overflow-hidden group/card p-8 md:p-10",
          className,
          innerClassName
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PremiumCard.displayName = "PremiumCard";
