import NextLink from "next/link";
import type { ComponentProps } from "react";

type SiteLinkProps = ComponentProps<typeof NextLink>;

/** Internal nav link — prefetch off (static export on Apache breaks on HEAD/RSC prefetch). */
export function SiteLink({ prefetch = false, ...props }: SiteLinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
