import { AdminNav } from "@/components/admin/admin-nav";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background/95 text-foreground">
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10  border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3" />
              Admin Portal
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic drop-shadow-sm">
              Inventory Management
            </h1>
          </div>
        </header>
        <AdminNav />

        <main className="relative">{children}</main>
      </div>
    </div>
  );
}
