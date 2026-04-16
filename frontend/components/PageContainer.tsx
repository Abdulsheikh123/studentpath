import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
