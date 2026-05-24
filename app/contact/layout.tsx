import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lisa Aufox | Contact",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
