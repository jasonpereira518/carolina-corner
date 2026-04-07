import { render, screen, waitFor } from "@testing-library/react";
import { CameraPreview } from "@/components/booth/CameraPreview";

describe("camera preview", () => {
  it("shows fallback error if media permission fails", async () => {
    Object.defineProperty(global.navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockRejectedValue(new Error("denied")),
      },
    });

    render(<CameraPreview />);

    await waitFor(() => {
      expect(
        screen.getByText("Camera preview unavailable. You can still continue."),
      ).toBeInTheDocument();
    });
  });
});
