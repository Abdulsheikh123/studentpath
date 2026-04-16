import AdminModulePage from "@/components/admin/AdminModulePage";

export default async function SuperAdminResourcePage({
  params,
}: {
  params: Promise<{ section: string; page: string }>;
}) {
  const { section, page } = await params;

  return <AdminModulePage moduleKey={`${section}/${page}`} />;
}

