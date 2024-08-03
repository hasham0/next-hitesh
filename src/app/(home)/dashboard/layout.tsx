interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <section className="flex min-h-screen flex-col">{children}</section>;
}
