"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/index", num: "01", label: "Index" },
  { href: "/lab", num: "02", label: "Lab" },
  { href: "/ethos", num: "03", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav
      className="main-nav font-sans text-[14px] tracking-[0.1em] uppercase"
      aria-label="Primary"
    >
      <ul className="flex items-center gap-x-4 min-[575px]:gap-x-8 min-[975px]:justify-end min-[975px]:gap-x-10">
        {nav.map(({ href, num, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "relative z-10 text-ethos-blue underline decoration-ethos-blue decoration-[1px] underline-offset-[0.35em]"
                    : "relative z-10 text-gray-900 no-underline"
                }
              >
                <span className="min-[575px]:hidden">[{label}]</span>
                <span className="hidden min-[575px]:inline">[ {num} {label} ]</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
