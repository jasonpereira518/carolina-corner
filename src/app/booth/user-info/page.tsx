"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BoothStepGate } from "@/components/booth/BoothStepGate";
import { useBooth } from "@/components/booth/BoothProvider";
import { BrandHeader, BoothShell, PrimaryButton } from "@/components/booth/BoothUI";
import { routeForStep } from "@/lib/booth/flow";

const GENERIC_LOGIN = {
  firstName: "Guest",
  onyen: "guest",
  email: "guest@unc.edu",
} as const;

export default function UserInfoPage() {
  const { content, setUser, goToStep, session } = useBooth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(
    session.userProfile?.firstName ?? GENERIC_LOGIN.firstName,
  );
  const [onyen, setOnyen] = useState(session.userProfile?.onyen ?? GENERIC_LOGIN.onyen);
  const [email, setEmail] = useState(session.userProfile?.email ?? GENERIC_LOGIN.email);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await setUser({ firstName, onyen, email });
    await goToStep("legal");
    router.push(routeForStep("legal"));
  }

  return (
    <BoothStepGate expectedStep="user-info">
      <BoothShell tone="sky">
        <BrandHeader label={content.theme.logoWordmark} />
        <section className="stack">
          <h1>{content.copy.userInfo.title}</h1>
          <p className="lead">{content.copy.userInfo.body}</p>
          <form className="stack form" onSubmit={onSubmit}>
            <label className="field">
              <span>{content.copy.userInfo.fields.firstName} *</span>
              <input
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>
            <label className="field">
              <span>{content.copy.userInfo.fields.onyen} *</span>
              <input
                required
                value={onyen}
                onChange={(event) => setOnyen(event.target.value)}
              />
            </label>
            <label className="field">
              <span>{content.copy.userInfo.fields.email} *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <PrimaryButton type="submit">{content.copy.userInfo.cta}</PrimaryButton>
          </form>
        </section>
      </BoothShell>
    </BoothStepGate>
  );
}
