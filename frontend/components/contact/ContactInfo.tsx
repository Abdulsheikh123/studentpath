"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { quickContacts } from "../contact-data";

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2 lg:mb-4">
        <p className="text-sm font-bold tracking-widest text-cyan-600 uppercase dark:text-cyan-400">
          Quick Contact
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Get Instant Help
        </h2>
      </div>
      {quickContacts.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm transition-all hover:bg-muted/10"
          >
            <CardHeader className="flex flex-row items-center gap-5 px-6 pt-6 sm:px-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/20 text-cyan-600 dark:bg-cyan-300/10 dark:text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-6 pb-6 sm:px-8 sm:pb-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="pt-2">
                {item.details.map((detail) => {
                  const isEmail = detail.toLowerCase().includes("email:");
                  const isPhone = detail.toLowerCase().includes("phone:");
                  const emailValue = detail.split(":")[1]?.trim();
                  const phoneValue = detail.split(":")[1]?.trim();

                  if (isEmail && emailValue) {
                    return (
                      <a
                        key={detail}
                        href={`mailto:${emailValue}`}
                        className="block font-mono text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-500 hover:underline dark:text-cyan-400"
                      >
                        {detail}
                      </a>
                    );
                  }

                  if (isPhone && phoneValue) {
                    const cleanPhone = phoneValue.replace(/\s+/g, "");
                    return (
                      <a
                        key={detail}
                        href={`tel:${cleanPhone}`}
                        className="block font-mono text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-500 hover:underline dark:text-cyan-400"
                      >
                        {detail}
                      </a>
                    );
                  }

                  return (
                    <p
                      key={detail}
                      className="font-mono text-sm font-medium text-foreground"
                    >
                      {detail}
                    </p>
                  );
                })}
              </div>
              {item.title === "WhatsApp Support" ? (
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-500">
                    Chat on WhatsApp
                  </Button>
                </a>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
