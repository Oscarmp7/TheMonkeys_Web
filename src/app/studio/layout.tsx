import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Monkeys — CMS",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
