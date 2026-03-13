import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {children}
    </div>
  );
}
