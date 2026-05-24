"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { href: "https://www.linkedin.com/in/lisaaufox/", label: "LinkedIn", external: true },
  { href: "/resume.pdf", label: "Resume", external: false },
  { href: "/doodles", label: "Doodles", external: false },
  { href: "/contact", label: "Contact", external: false },
] as const;

export function FooterNav() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-y-1 min-[575px]:flex-row min-[575px]:items-center min-[575px]:gap-x-6 font-sans text-[13px] tracking-[0.08em] uppercase">
      {footerLinks.map(({ href, label, external }) => {
        const active = !external && pathname === href;
        return (
          <li key={href}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900"
              >
                {label}
              </a>
            ) : (
              <Link
                href={href}
                className={active ? "text-ethos-blue" : "text-gray-900"}
              >
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
