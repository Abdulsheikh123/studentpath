export type NavItem = {
  href: string;
  name: string;
};

export const navItems: NavItem[] = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/admissions", name: "Admissions" },
  { href: "/exams", name: "Exams" },
  { href: "/colleges", name: "Colleges" },
  // { href: "/universities", name: "Universities" },
  { href: "/contact", name: "Contact" },
];
