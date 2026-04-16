"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SheetContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("Sheet components must be used within Sheet");
  return context;
}

function renderWithProps(
  render: React.ReactElement | undefined,
  props: Record<string, unknown> & { className?: string },
  children?: React.ReactNode,
) {
  if (render && React.isValidElement(render)) {
    const element = render as React.ReactElement<Record<string, unknown>>;

    return React.cloneElement(element, {
      ...props,
      className: cn(element.props.className as string | undefined, props.className),
      children,
    });
  }

  return null;
}

function Sheet({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({
  children,
  render,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  render?: React.ReactElement;
}) {
  const { setOpen } = useSheetContext();

  if (render) {
    return renderWithProps(
      render,
      {
        ...props,
        className,
        onClick: () => setOpen(true),
      },
      children,
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetClose({
  children,
  render,
  className,
  nativeButton,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  render?: React.ReactElement;
  nativeButton?: boolean;
}) {
  const { setOpen } = useSheetContext();
  void nativeButton;

  if (render) {
    return renderWithProps(
      render,
      {
        ...props,
        className,
        onClick: () => setOpen(false),
      },
      children,
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

function SheetOverlay({ className }: { className?: string }) {
  const { setOpen } = useSheetContext();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/20 backdrop-blur-xs",
        className,
      )}
      onClick={() => setOpen(false)}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
}: {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  const { open, setOpen } = useSheetContext();

  if (!open) return null;

  const sideClasses = {
    top: "inset-x-0 top-0 border-b",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover text-popover-foreground shadow-lg",
          sideClasses[side],
          className,
        )}
      >
        {children}
        {showCloseButton ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3"
            onClick={() => setOpen(false)}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        ) : null}
      </div>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-0.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-base font-medium text-foreground", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
};
