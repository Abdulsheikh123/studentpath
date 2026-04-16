import { redirect } from "next/navigation";

export default function LegacyAdminContactPage() {
  redirect("/admin/users/contact-requests");
}
