// src/index.ts
import { z } from "zod";
import type { Alpine } from "alpinejs";

type ZodSchema<T> = z.ZodType<T>;

export default function alpineManagePlugin(Alpine: Alpine) {
  Alpine.magic("manage", () => {
    return function <T>(elementId: string, schema: ZodSchema<T>): T {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found.`);
      }

      const xData = element.getAttribute("x-data");
      if (!xData) {
        throw new Error(
          `Element with id "${elementId}" does not have an "x-data" attribute.`
        );
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(xData);
      } catch (err) {
        throw new Error(
          `Failed to parse "x-data" as JSON for element "${elementId}": ${
            (err as Error).message
          }`
        );
      }

      const result = schema.safeParse(parsed);
      if (!result.success) {
        throw new Error(
          `Validation failed for element "${elementId}": ${JSON.stringify(
            result.error.format(),
            null,
            2
          )}`
        );
      }

      return result.data;
    };
  });
}
