import AdminOrdersTab from '@/components/admin-orders-tab';

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto py-8 md:py-12 px-4">
            <AdminOrdersTab />
        </div>
    </div>
  );
}
