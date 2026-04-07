import { BoothProvider } from "@/components/booth/BoothProvider";

export default function BoothLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BoothProvider>{children}</BoothProvider>;
}
