import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Deterministic media mocks for CI/headless runs.
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => new MediaStream(),
      },
    });

    class FakeMediaRecorder {
      public ondataavailable: ((event: BlobEvent) => void) | null = null;
      public onstop: (() => void) | null = null;

      start() {
        setTimeout(() => {
          const blob = new Blob(["mock-video"], { type: "video/webm" });
          this.ondataavailable?.({ data: blob } as BlobEvent);
        }, 20);
      }

      stop() {
        setTimeout(() => this.onstop?.(), 30);
      }
    }

    // @ts-expect-error test-only shim
    window.MediaRecorder = FakeMediaRecorder;
  });
});

async function fillUserInfo(page: import("@playwright/test").Page) {
  await page.waitForURL("**/booth/user-info");
  await page.locator("input").nth(0).fill("Jordan");
  await page.locator("input").nth(1).fill("jordan123");
  await page.locator("input").nth(2).fill("jordan@example.com");
  await page.getByRole("button", { name: "Next", exact: true }).click();
}

test("happy path with one submitted prompt", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continue" }).click();
  await fillUserInfo(page);
  await page.getByRole("button", { name: "Accept" }).click();
  await page.getByRole("button", { name: /Prompt 1/ }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForURL("**/booth/prompt/quote");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForURL("**/booth/prompt/preview");
  await page.getByRole("button", { name: /Start/ }).click();
  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("button", { name: "No thanks" }).click();
  await page.getByRole("button", { name: "Finish up" }).click();
  await expect(page.getByText("See you next time.")).toBeVisible();
});

test("decline legal path returns to start", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continue" }).click();
  await fillUserInfo(page);
  await page.getByRole("button", { name: "Decline" }).click();
  await page.getByRole("button", { name: "Back to start" }).click();
  await expect(page.getByText("Welcome to Carolina Corner")).toBeVisible();
});

test("multi-prompt path with try again", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continue" }).click();
  await fillUserInfo(page);
  await page.getByRole("button", { name: "Accept" }).click();

  await page.getByRole("button", { name: /Prompt 2/ }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForURL("**/booth/prompt/quote");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForURL("**/booth/prompt/preview");
  await page.getByRole("button", { name: /Start/ }).click();
  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Try Again" }).click();
  await page.getByRole("button", { name: /Start/ }).click();
  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Submit" }).click();

  await page.getByRole("button", { name: /Prompt 3/ }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForURL("**/booth/prompt/quote");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForURL("**/booth/prompt/preview");
  await page.getByRole("button", { name: /Start/ }).click();
  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Submit" }).click();

  await page.getByRole("button", { name: "No thanks" }).click();
  await expect(page.getByText("Your story is on the way.")).toBeVisible();
});
