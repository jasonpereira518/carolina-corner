import { render, screen } from "@testing-library/react";
import { boothContent } from "@/lib/booth/content";
import { BrandHeader, BoothShell } from "@/components/booth/BoothUI";

describe("welcome copy contract", () => {
  it("renders branded wordmark and title copy from content", () => {
    render(
      <BoothShell tone="sky">
        <BrandHeader label={boothContent.theme.logoWordmark} />
        <h1>{boothContent.copy.welcome.title}</h1>
      </BoothShell>,
    );

    expect(screen.getByText(boothContent.theme.logoWordmark)).toBeInTheDocument();
    expect(screen.getByText(boothContent.copy.welcome.title)).toBeInTheDocument();
  });
});
