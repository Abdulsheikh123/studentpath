import Link from "next/link";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

import BrandLogo from "./BrandLogo";
import PageContainer from "./PageContainer";
import { navItems } from "./site-data";

const legalLinks = [
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookies-policy", label: "Cookies Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: FaGithub },
  { href: "https://www.linkedin.com", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://www.facebook.com", label: "Facebook", icon: FaFacebook },
  { href: "https://www.instagram.com", label: "Instagram", icon: FaInstagram },
  {
    href: "https://telegram.org",
    label: "Telegram",
    icon: FaTelegramPlane,
  },
  { href: "https://www.whatsapp.com", label: "WhatsApp", icon: FaWhatsapp },
];

export default function SiteFooter() {
  return (
    <footer className="bg-background text-foreground">
      <PageContainer className="border-t border-border/60 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <BrandLogo href="/" />
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              StudentPath helps students and parents explore school admissions,
              entrance exams, colleges, scholarships, and career guidance across
              India through one responsive education platform.
            </p>
          </div>

          <div className="space-y-6 lg:justify-self-end">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Pages</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 lg:justify-end">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Social</p>
              <div className="flex flex-wrap items-center gap-3 lg:justify-center">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6">
          <div className="flex flex-col gap-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <p className="leading-6">
              © 2026 studentpath. All rights reserved. Developed by
              john@gmail.com
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
