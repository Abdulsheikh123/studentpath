import { Suspense } from "react";
import AdminFaqManager from "@/components/admin/AdminFaqManager";

export default function AdminFaqPage() {
  return (
    <Suspense fallback={null}>
      <AdminFaqManager />
    </Suspense>
  );
}
