"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: React.ReactNode;
};

type SelectContextValue = {
  options: SelectOption[];
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function isElementOfType(
  child: React.ReactNode,
  component: React.ElementType,
): child is React.ReactElement {
  return React.isValidElement(child) && child.type === component;
}

function extractOptions(children: React.ReactNode): SelectOption[] {
  const items: SelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const element = child as React.ReactElement<Record<string, unknown>>;

    if (element.type === SelectItem) {
      items.push({
        value: element.props.value as string,
        label: element.props.children as React.ReactNode,
      });
      return;
    }

    if (element.props?.children) {
      items.push(...extractOptions(element.props.children as React.ReactNode));
    }
  });

  return items;
}

function Select({ 
  children,
  onValueChange,
  defaultValue,
  value,
  disabled
}: { 
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
}) {
  const options = React.useMemo(() => extractOptions(children), [children]);

  return (
    <SelectContext.Provider value={{ options }}>
      <div className="w-full">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onValueChange?.(e.target.value),
              value,
              defaultValue,
              disabled
            });
          }
          return null;
        })}
      </div>
    </SelectContext.Provider>
  );
}

function SelectGroup({
  className,
  children,
}: React.ComponentProps<"div">) {
  return <div className={cn("scroll-my-1 p-1", className)}>{children}</div>;
}

function SelectValue(props: { placeholder?: string; className?: string }) {
  void props;
  return null;
}

function SelectTrigger({
  className,
  triggerSize = "default",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  triggerSize?: "sm" | "default";
}) {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("SelectTrigger must be used within Select");
  }

  let placeholder = "";

  React.Children.forEach(children, (child) => {
    if (isElementOfType(child, SelectValue)) {
      const element = child as React.ReactElement<{ placeholder?: string }>;
      placeholder = element.props.placeholder ?? "";
    }
  });

  return (
    <div className="relative w-full">
      <select
        className={cn(
          "flex w-full appearance-none items-center justify-between gap-1.5 rounded-lg border border-input bg-background py-2 pr-9 pl-2.5 text-sm text-foreground whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 scheme-light dark:scheme-dark dark:bg-background dark:hover:bg-background dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          triggerSize === "default" ? "h-8" : "h-7 rounded-[10px]",
          className,
        )}
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
        {...props}
      >
        {placeholder ? (
          <option
            value=""
            disabled
            style={{
              backgroundColor: "var(--background)",
              color: "var(--muted-foreground)",
            }}
          >
            {placeholder}
          </option>
        ) : null}
        {context.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            {typeof option.label === "string" ? option.label : option.value}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function SelectContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  void children;
  return null;
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem({
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)} {...props} />;
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
