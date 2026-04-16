import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "StudentPath Admin",
  description:
    "StudentPath admin panel for content, support, and system management.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
      enableSystem={false}
    >
      <div className="admin-dark relative min-h-screen min-w-0 overflow-x-hidden text-slate-100">
        <div className="fixed inset-0 z-0 bg-slate-950" />
        <div className="relative z-10 min-h-screen w-full min-w-0">{children}</div>
      </div>
    </ThemeProvider>
  );
}
