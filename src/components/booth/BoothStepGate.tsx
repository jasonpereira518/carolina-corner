"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { canTransition, routeForStep } from "@/lib/booth/flow";
import { BoothStep } from "@/lib/booth/types";
import { useBooth } from "@/components/booth/BoothProvider";

export function BoothStepGate({
  expectedStep,
  children,
}: {
  expectedStep: BoothStep;
  children: React.ReactNode;
}) {
  const { session } = useBooth();
  const router = useRouter();
  const allowed = session.step === expectedStep || canTransition(session.step, expectedStep);

  useEffect(() => {
    if (!allowed) {
      const currentRoute = routeForStep(session.step);
      router.replace(currentRoute);
    }
  }, [allowed, session.step, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
