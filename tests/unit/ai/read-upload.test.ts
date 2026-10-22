import { describe, expect, it } from "vitest";

import { readLimitedBody } from "../../../lib/ai/transcription/read-upload";

describe("Bounded upload reader", () => {
  it("accepts a request within the size limit", async () => {
    const request = new Request("http://localhost/api/ai/transcribe", {
      method: "POST",
      body: Buffer.alloc(100),
    });

    const result = await readLimitedBody(request, 200);

    expect(result.byteLength).toBe(100);
  });

  it("rejects a request exceeding the size limit", async () => {
    const request = new Request("http://localhost/api/ai/transcribe", {
      method: "POST",
      body: Buffer.alloc(300),
    });

    await expect(readLimitedBody(request, 200)).rejects.toThrow(
      "Upload exceeds the maximum allowed size.",
    );
  });

  it("rejects requests without a body", async () => {
    const request = new Request("http://localhost/api/ai/transcribe", {
      method: "POST",
    });

    await expect(readLimitedBody(request)).rejects.toThrow(
      "Request body is missing.",
    );
  });
});
