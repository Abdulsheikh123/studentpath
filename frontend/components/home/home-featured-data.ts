import { BookOpen, Building2, GraduationCap, Star } from "lucide-react";

export const featuredCards = [
  {
    name: "Delhi Public School",
    type: "School",
    description:
      "Well-known school for strong academics, competitive exam support, and balanced student development.",
    image: "/dps-campus.svg",
    rating: 4.8,
    href: "/schools",
    icon: GraduationCap,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "IIT Delhi",
    type: "College",
    description:
      "Leading engineering college with strong research culture, placements, and national academic reputation.",
    image: "/iit-delhi.svg",
    rating: 4.9,
    href: "/colleges",
    icon: Building2,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    name: "Delhi University",
    type: "College",
    description:
      "Popular university offering broad undergraduate and postgraduate programs across multiple streams.",
    image: "/du-campus.svg",
    rating: 4.7,
    href: "/colleges",
    icon: BookOpen,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    name: "JEE Main",
    type: "Common Entrance Exam",
    description:
      "Major national entrance exam for engineering admissions and the first step toward top institutes.",
    image: "/student-journey-visual.svg",
    rating: 4.6,
    href: "/exams",
    icon: Star,
    accent: "bg-amber-100 text-amber-700",
  },
] as const;
