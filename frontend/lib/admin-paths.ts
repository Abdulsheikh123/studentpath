export function normalizeInstitutionType(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function getPartnerDashboardPath(institutionType?: string | null) {
  const normalized = normalizeInstitutionType(institutionType);

  if (normalized === "university") return "/admin/partner/university/dashboard";
  if (normalized === "college") return "/admin/partner/college/dashboard";
  if (normalized === "school") return "/admin/partner/school/dashboard";

  return "/admin/partner/dashboard";
}

