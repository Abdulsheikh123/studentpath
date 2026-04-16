import AdminModulePage from "@/components/admin/AdminModulePage";

export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ section: string; page: string }>;
}) {
  const { section, page } = await params;

  return <AdminModulePage moduleKey={`${section}/${page}`} />;
}
