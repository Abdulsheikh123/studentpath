"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionContextValue = {
  type: "single" | "multiple";
  value: string[];
  toggleValue: (nextValue: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type AccordionProps = React.ComponentProps<"div"> & {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
};

function Accordion({
  className,
  type = "single",
  defaultValue,
  collapsible = false,
  ...props
}: AccordionProps) {
  const initialValue = React.useMemo(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    if (defaultValue) return [defaultValue];
    return [];
  }, [defaultValue]);

  const [value, setValue] = React.useState<string[]>(initialValue);

  const toggleValue = React.useCallback(
    (nextValue: string) => {
      setValue((currentValue) => {
        const isOpen = currentValue.includes(nextValue);

        if (type === "multiple") {
          return isOpen
            ? currentValue.filter((item) => item !== nextValue)
            : [...currentValue, nextValue];
        }

        if (isOpen) {
          return collapsible ? [] : currentValue;
        }

        return [nextValue];
      });
    },
    [collapsible, type],
  );

  return (
    <AccordionContext.Provider value={{ type, value, toggleValue }}>
      <div className={cn("w-full", className)} {...props} />
    </AccordionContext.Provider>
  );
}

type AccordionItemContextValue = {
  value: string;
  open: boolean;
  onToggle: () => void;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function AccordionItem({
  className,
  value,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem must be used within Accordion");
  }

  const open = context.value.includes(value);

  return (
    <AccordionItemContext.Provider
      value={{ value, open, onToggle: () => context.toggleValue(value) }}
    >
      <div
        data-state={open ? "open" : "closed"}
        className={cn("border-b border-border/60", className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(AccordionItemContext);

  if (!context) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  return (
    <button
      type="button"
      aria-expanded={context.open}
      onClick={context.onToggle}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium transition-all hover:text-foreground",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
        <Plus
          className={cn(
            "absolute h-4 w-4 transition-all duration-300 ease-out",
            context.open ? "scale-75 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Minus
          className={cn(
            "absolute h-4 w-4 transition-all duration-300 ease-out",
            context.open ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
        />
      </span>
    </button>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(AccordionItemContext);

  if (!context) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }

  return (
    <div
      data-state={context.open ? "open" : "closed"}
      className={cn(
        "grid overflow-hidden transition-all duration-300 ease-out",
        context.open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
      {...props}
    >
      <div className="min-h-0">
        <div className="pb-5 text-sm leading-7 text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
