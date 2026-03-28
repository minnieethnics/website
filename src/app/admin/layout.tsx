import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminAuthGuard } from '@/components/layout/AdminAuthGuard';

export const metadata = { title: 'Admin — Minnie Ethnics' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#F4F2EE]" style={{ position: 'relative', zIndex: 10 }}>
        <AdminSidebar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </AdminAuthGuard>
  );
}
